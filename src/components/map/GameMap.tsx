'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import {
  WORLD_MAP, TILE_SIZE, MAP_COLS, MAP_ROWS,
  TILE_COLORS, STATIC_ENTITIES, isTileWalkable,
  type ItemEntity, type ModulePortal, type NPC,
} from '@/data/map/worldMap';
import { ITEMS } from '@/data/map/items';
import { THEORY_FRAGMENTS, type TheoryFragment } from '@/data/map/fragments';
import { MINI_ENCOUNTERS, type MiniEncounter as MiniEncounterType } from '@/data/map/encounters';
import { REGION_LOCKS } from '@/data/map/locks';
import { EVENT_TRIGGERS } from '@/data/map/triggers';
import { useGameMap, type Direction } from '@/hooks/useGameMap';
import { usePlayerStore } from '@/store/playerStore';
import PlayerSprite from './PlayerSprite';
import HUD from './HUD';
import NPCDialogueBox from './NPCDialogueBox';
import TheoryFragmentPop from './TheoryFragmentPop';
import MiniEncounterModal from './MiniEncounter';
import QuestMarker from './QuestMarker';
import ModulePage from '@/components/quests/ModulePage';
import { MODULE1 } from '@/data/modules/module1';
import { MODULE2 } from '@/data/modules/module2';
import { MODULE3 } from '@/data/modules/module3';
import { MODULE4 } from '@/data/modules/module4';
import { MODULE5 } from '@/data/modules/module5';
import { MODULE6 } from '@/data/modules/module6';

// ── Module map ──────────────────────────────────────────────────────────────
const MODULE_MAP: Record<number, typeof MODULE1 | typeof MODULE2 | typeof MODULE3 | typeof MODULE4 | typeof MODULE5 | typeof MODULE6> = {
  1: MODULE1, 2: MODULE2, 3: MODULE3, 4: MODULE5, 5: MODULE6, 6: MODULE4,
};

// ── Toast ───────────────────────────────────────────────────────────────────
interface Toast { id: number; text: string; emoji: string; color: string }
let toastCounter = 0;

// ── Helpers ─────────────────────────────────────────────────────────────────
function isNear(ac: number, ar: number, bc: number, br: number, radius = 1) {
  return Math.abs(ac - bc) <= radius && Math.abs(ar - br) <= radius;
}

export default function GameMap() {
  const store = usePlayerStore();
  const [toasts, setToasts]                       = useState<Toast[]>([]);
  const [activeNPC, setActiveNPC]                 = useState<NPC | null>(null);
  const [npcTalkCount, setNpcTalkCount]           = useState<Record<string, number>>({});
  const [activeFragment, setActiveFragment]       = useState<TheoryFragment | null>(null);
  const [activeMiniEncounter, setActiveMiniEncounter] = useState<MiniEncounterType | null>(null);
  const [portalConfirm, setPortalConfirm]         = useState<ModulePortal | null>(null);
  const [activeModule, setActiveModule]           = useState<number | null>(null);
  const [itemPickup, setItemPickup]               = useState<{ item: typeof ITEMS[string] } | null>(null);
  const triggeredRef   = useRef<Set<string>>(new Set());
  const encounterRef   = useRef<boolean>(false); // prevents double-trigger

  function addToast(text: string, emoji: string, color: string) {
    const id = toastCounter++;
    setToasts((t) => [...t.slice(-3), { id, text, emoji, color }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }

  // ── Precompute locked tile set ─────────────────────────────────────────
  const lockedTileSet = useMemo(() => {
    const s = new Set<string>();
    for (const lock of REGION_LOCKS) {
      if (!lock.requiredModules.every((m) => store.completedModules.includes(m))) {
        for (let c = lock.colMin; c <= lock.colMax; c++) {
          for (let r = lock.rowMin; r <= lock.rowMax; r++) {
            if (isTileWalkable(c, r)) s.add(`${c},${r}`);
          }
        }
      }
    }
    return s;
  }, [store.completedModules]);

  // ── Precompute completed-module aura tiles (3×3 around portal) ─────────
  const completedAuraTiles = useMemo(() => {
    const s = new Set<string>();
    for (const e of STATIC_ENTITIES) {
      if (e.kind === 'portal' && store.completedModules.includes(e.moduleId)) {
        for (let dc = -1; dc <= 1; dc++)
          for (let dr = -1; dr <= 1; dr++)
            s.add(`${e.col + dc},${e.row + dr}`);
      }
    }
    return s;
  }, [store.completedModules]);

  // ── isBlocked for useGameMap ───────────────────────────────────────────
  const isBlocked = useCallback((col: number, row: number) => {
    return lockedTileSet.has(`${col},${row}`);
  }, [lockedTileSet]);

  // ── On player step ─────────────────────────────────────────────────────
  const onStep = useCallback((col: number, row: number) => {
    // Theory Fragment detection
    for (const frag of THEORY_FRAGMENTS) {
      if (col === frag.col && row === frag.row && !store.discoveredFragments.includes(frag.id)) {
        store.discoverFragment(frag.id);
        setActiveFragment(frag);
      }
    }

    // Mini Encounter detection
    for (const enc of MINI_ENCOUNTERS) {
      if (col === enc.col && row === enc.row
          && !store.completedEncounters.includes(enc.id)
          && !encounterRef.current) {
        encounterRef.current = true;
        setActiveMiniEncounter(enc);
        break;
      }
    }

    // Region Lock notification (player approaches boundary)
    for (const lock of REGION_LOCKS) {
      if (!lock.requiredModules.every((m) => store.completedModules.includes(m))) {
        const atBoundary =
          (col === lock.colMin - 1 || col === lock.colMax + 1) &&
          row >= lock.rowMin && row <= lock.rowMax;
        const atVerticalBoundary =
          (row === lock.rowMin - 1 || row === lock.rowMax + 1) &&
          col >= lock.colMin && col <= lock.colMax;
        if (atBoundary || atVerticalBoundary) {
          const trigKey = `lock-warn:${lock.id}`;
          if (!triggeredRef.current.has(trigKey)) {
            triggeredRef.current.add(trigKey);
            addToast(lock.description, '🔒', '#4A5568');
            setTimeout(() => triggeredRef.current.delete(trigKey), 8000);
          }
        }
      }
    }

    // Event trigger detection
    for (const trigger of EVENT_TRIGGERS) {
      const dist = Math.max(Math.abs(col - trigger.col), Math.abs(row - trigger.row));
      if (dist <= trigger.radius) {
        const trigKey = `trigger:${trigger.id}`;
        if (!triggeredRef.current.has(trigKey)) {
          const reqOk = !trigger.requiredModules
            || trigger.requiredModules.every((m) => store.completedModules.includes(m));
          if (reqOk && trigger.message) {
            triggeredRef.current.add(trigKey);
            addToast(trigger.message, '💬', '#22D3EE');
            setTimeout(() => triggeredRef.current.delete(trigKey), 12000);
          }
        }
      }
    }

    // Static entities
    for (const entity of STATIC_ENTITIES) {
      const key = `${entity.kind}:${
        entity.kind === 'item'   ? entity.id
        : entity.kind === 'portal' ? entity.moduleId
        : entity.id
      }`;

      if (entity.kind === 'item') {
        const e = entity as ItemEntity;
        if (isNear(col, row, e.col, e.row, 0) && !store.collectedItemIds.includes(e.id) && !triggeredRef.current.has(key)) {
          triggeredRef.current.add(key);
          const item = ITEMS[e.itemId];
          store.collectItem(e.id, e.itemId);
          if (item.effect.type === 'xp_boost') store.setXPBoost(item.effect.value);
          if (item.effect.type === 'stat_boost') store.addStats({ [item.effect.stat]: item.effect.value } as Parameters<typeof store.addStats>[0]);
          setItemPickup({ item });
          addToast(`獲得 ${item.nameZh}！`, item.emoji, item.accentColor);
          setTimeout(() => { setItemPickup(null); triggeredRef.current.delete(key); }, 2500);
        }
      }

      if (entity.kind === 'npc') {
        const e = entity as NPC;
        if (isNear(col, row, e.col, e.row, 1)
            && !triggeredRef.current.has(key)
            && !activeNPC
            && !store.talkedNPCs.includes(e.id)) {
          triggeredRef.current.add(key);
          setActiveNPC(e);
        }
      }

      if (entity.kind === 'portal') {
        const e = entity as ModulePortal;
        if (isNear(col, row, e.col, e.row, 0) && !triggeredRef.current.has(key)) {
          triggeredRef.current.add(key);
          setPortalConfirm(e);
        }
      }
    }
  }, [store, activeNPC]);

  // ── NPC handlers ───────────────────────────────────────────────────────
  function closeNPC() {
    if (!activeNPC) return;
    const key = `npc:${activeNPC.id}`;
    store.talkToNPC(activeNPC.id);
    setNpcTalkCount((prev) => ({ ...prev, [activeNPC.id]: (prev[activeNPC.id] ?? 0) + 1 }));
    setActiveNPC(null);
    setTimeout(() => triggeredRef.current.delete(key), 2000);
  }

  function handleGiveFragment(fragmentId: string) {
    if (!store.discoveredFragments.includes(fragmentId)) {
      store.discoverFragment(fragmentId);
      const frag = THEORY_FRAGMENTS.find((f) => f.id === fragmentId);
      if (frag) setActiveFragment(frag);
    }
  }

  // ── Portal handlers ────────────────────────────────────────────────────
  function dismissPortal() {
    if (portalConfirm) setTimeout(() => triggeredRef.current.delete(`portal:${portalConfirm.moduleId}`), 500);
    setPortalConfirm(null);
  }
  function enterPortal() {
    if (!portalConfirm) return;
    const mid = portalConfirm.moduleId;
    setPortalConfirm(null);
    setActiveModule(mid);
  }
  function closeOverlay() {
    if (activeModule !== null) setTimeout(() => triggeredRef.current.delete(`portal:${activeModule}`), 800);
    setActiveModule(null);
  }

  // ── Map disabled when any modal is open ───────────────────────────────
  const mapDisabled = activeModule !== null || portalConfirm !== null
    || activeNPC !== null || activeFragment !== null || activeMiniEncounter !== null;

  const { pos, facing, walking, step, pressDir, releaseDir } = useGameMap({
    startCol: 3, startRow: 5, onStep, disabled: mapDisabled, isBlocked,
  });

  // Camera
  const viewW = typeof window !== 'undefined' ? window.innerWidth : MAP_COLS * TILE_SIZE;
  const viewH = typeof window !== 'undefined' ? window.innerHeight - 56 : MAP_ROWS * TILE_SIZE;
  const camX = Math.max(0, Math.min(pos.col * TILE_SIZE - viewW / 2, MAP_COLS * TILE_SIZE - viewW));
  const camY = Math.max(0, Math.min(pos.row * TILE_SIZE - viewH / 2, MAP_ROWS * TILE_SIZE - viewH));

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#0D1B2A', userSelect: 'none', overflow: 'hidden' }}>
      <HUD inventory={store.inventory} xpBoost={store.activeXPBoost} fragmentCount={store.discoveredFragments.length} />

      <div style={{ position: 'relative', flex: 1, width: '100vw', overflow: 'hidden' }}>
        {/* Scrolling world */}
        <div style={{
          position: 'absolute', left: -camX, top: -camY,
          width: MAP_COLS * TILE_SIZE, height: MAP_ROWS * TILE_SIZE,
          transition: 'left 0.1s linear, top 0.1s linear',
        }}>

          {/* ── Tiles ── */}
          {WORLD_MAP.map((rowArr, row) =>
            rowArr.map((tile, col) => {
              const key = `${col},${row}`;
              const isLocked = lockedTileSet.has(key);
              const hasAura = completedAuraTiles.has(key);
              return (
                <div key={key} style={{
                  position: 'absolute',
                  left: col * TILE_SIZE, top: row * TILE_SIZE,
                  width: TILE_SIZE, height: TILE_SIZE,
                  background: TILE_COLORS[tile],
                  boxSizing: 'border-box',
                  borderRight: '1px solid rgba(0,0,0,0.15)',
                  borderBottom: '1px solid rgba(0,0,0,0.15)',
                }}>
                  {tile === 5 && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>🌲</span>}
                  {tile === 6 && <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>⛰️</span>}
                  {tile === 0 && <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 8px)' }} />}

                  {/* Completed module aura */}
                  {hasAura && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(76,175,80,0.15)',
                      pointerEvents: 'none',
                    }} />
                  )}

                  {/* Region lock overlay */}
                  {isLocked && (
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'rgba(0,0,0,0.55)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      pointerEvents: 'none',
                    }}>
                      <span style={{ fontSize: 16, opacity: 0.6 }}>🔒</span>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* ── Fragment markers ── */}
          {THEORY_FRAGMENTS.map((frag) => {
            if (store.discoveredFragments.includes(frag.id)) return null;
            // Only show within radius 2 of player
            const dist = Math.max(Math.abs(pos.col - frag.col), Math.abs(pos.row - frag.row));
            if (dist > 5) return null;
            const nearby = dist <= 1;
            return (
              <div key={frag.id}>
                <div style={{
                  position: 'absolute',
                  left: frag.col * TILE_SIZE, top: frag.row * TILE_SIZE,
                  width: TILE_SIZE, height: TILE_SIZE,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', zIndex: 8, pointerEvents: 'none',
                }}>
                  <div style={{
                    fontSize: 16,
                    animation: 'fragGlow 1.8s ease-in-out infinite',
                    filter: `drop-shadow(0 0 6px ${frag.color})`,
                  }}>
                    📖
                  </div>
                  {nearby && (
                    <div style={{
                      fontFamily: 'var(--font-pixel), monospace', fontSize: 6,
                      color: frag.color, letterSpacing: 1, marginTop: 1,
                      background: 'rgba(13,27,42,0.9)', padding: '1px 3px', whiteSpace: 'nowrap',
                    }}>
                      碎片
                    </div>
                  )}
                </div>
                {dist <= 2 && (
                  <QuestMarker col={frag.col} row={frag.row} tileSize={TILE_SIZE} type="fragment" pulse={nearby} />
                )}
              </div>
            );
          })}

          {/* ── Static entities ── */}
          {STATIC_ENTITIES.map((entity) => {
            if (entity.kind === 'item') {
              const e = entity as ItemEntity;
              if (store.collectedItemIds.includes(e.id)) return null;
              const item = ITEMS[e.itemId];
              const near = isNear(pos.col, pos.row, e.col, e.row, 1);
              return (
                <div key={e.id} style={{
                  position: 'absolute', left: e.col * TILE_SIZE, top: e.row * TILE_SIZE,
                  width: TILE_SIZE, height: TILE_SIZE,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', zIndex: 10,
                }}>
                  <div style={{ fontSize: 22, animation: 'mapItemBob 1.4s ease-in-out infinite', filter: `drop-shadow(0 0 6px ${item.accentColor})` }}>
                    {item.emoji}
                  </div>
                  {near && (
                    <div style={{
                      fontFamily: 'var(--font-pixel), monospace', fontSize: 6, color: item.accentColor,
                      letterSpacing: 1, marginTop: 2, background: 'rgba(13,27,42,0.85)',
                      padding: '1px 3px', whiteSpace: 'nowrap',
                    }}>
                      {item.nameZh}
                    </div>
                  )}
                </div>
              );
            }

            if (entity.kind === 'portal') {
              const e = entity as ModulePortal;
              const done = store.completedModules.includes(e.moduleId);
              const hasData = e.moduleId in MODULE_MAP;
              const accent = done ? '#4CAF50' : hasData ? e.accentColor : '#4A5568';
              return (
                <div key={`portal-${e.moduleId}`}>
                  <div style={{
                    position: 'absolute',
                    left: e.col * TILE_SIZE - 4, top: e.row * TILE_SIZE - 4,
                    width: TILE_SIZE + 8, height: TILE_SIZE + 8,
                    border: `3px solid ${accent}`,
                    boxShadow: `0 0 16px 4px ${accent}55, inset 0 0 20px 4px ${accent}22`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    zIndex: 10,
                    animation: done || !hasData ? undefined : 'portalPulse 2s ease-in-out infinite',
                    background: `${accent}11`,
                  }}>
                    <span style={{ fontSize: 20 }}>{done ? '✅' : !hasData ? '🔒' : e.emoji}</span>
                    <span style={{
                      fontFamily: 'var(--font-pixel), monospace', fontSize: 6, color: accent,
                      marginTop: 2, background: 'rgba(13,27,42,0.85)', padding: '1px 3px', whiteSpace: 'nowrap',
                    }}>
                      {done ? `✓ M${e.moduleId}` : `M${e.moduleId}`}
                    </span>
                  </div>
                  {/* Quest marker for unstarted modules */}
                  {!done && hasData && (
                    <QuestMarker col={e.col} row={e.row} tileSize={TILE_SIZE} type="module" pulse />
                  )}
                </div>
              );
            }

            if (entity.kind === 'npc') {
              const e = entity as NPC;
              const talked = store.talkedNPCs.includes(e.id);
              const isActive = activeNPC?.id === e.id;
              return (
                <div key={`npc-${e.id}`}>
                  <div style={{
                    position: 'absolute', left: e.col * TILE_SIZE, top: e.row * TILE_SIZE,
                    width: TILE_SIZE, height: TILE_SIZE,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, zIndex: 10,
                    animation: 'mapItemBob 2s ease-in-out infinite',
                    filter: isActive ? 'drop-shadow(0 0 10px rgba(255,215,0,0.8))' : undefined,
                  }}>
                    {e.emoji}
                  </div>
                  {!talked && (
                    <QuestMarker col={e.col} row={e.row} tileSize={TILE_SIZE} type="npc" />
                  )}
                </div>
              );
            }
            return null;
          })}

          {/* ── Player ── */}
          <div style={{
            position: 'absolute',
            left: pos.col * TILE_SIZE + (TILE_SIZE - 32) / 2,
            top: pos.row * TILE_SIZE + (TILE_SIZE - 36) / 2,
            zIndex: 20,
            transition: 'left 0.1s linear, top 0.1s linear',
          }}>
            <PlayerSprite facing={facing} walking={walking} step={step} size={32} />
          </div>
        </div>

        {/* ── Toasts ── */}
        <div style={{ position: 'absolute', top: 12, right: 16, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 100, pointerEvents: 'none' }}>
          {toasts.map((t) => (
            <div key={t.id} style={{
              background: 'rgba(13,27,42,0.95)', border: `2px solid ${t.color}`,
              padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8,
              animation: 'toastIn 0.3s ease', boxShadow: `0 0 12px 2px ${t.color}55`, maxWidth: 320,
            }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{t.emoji}</span>
              <span style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: 11, color: t.color, letterSpacing: 1, lineHeight: 1.5 }}>{t.text}</span>
            </div>
          ))}
        </div>

        {/* ── Portal confirm ── */}
        {portalConfirm && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }}>
            <div style={{
              background: 'var(--bg-secondary)', border: `4px solid ${portalConfirm.accentColor}`,
              padding: '32px 28px', maxWidth: 380, width: '90vw', textAlign: 'center',
              boxShadow: `0 0 40px 8px ${portalConfirm.accentColor}44`,
            }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>{portalConfirm.emoji}</div>
              <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: 11, color: portalConfirm.accentColor, letterSpacing: 2, margin: '0 0 6px' }}>MODULE {portalConfirm.moduleId}</p>
              <p style={{ fontFamily: 'var(--font-body), sans-serif', fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 20px' }}>{portalConfirm.label}</p>
              {!(portalConfirm.moduleId in MODULE_MAP) ? (
                <>
                  <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: 11, color: 'var(--accent-red)', margin: '0 0 20px', letterSpacing: 1 }}>此模組尚未開放</p>
                  <button onClick={dismissPortal} style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: 11, background: '#4A5568', color: 'var(--text-primary)', border: 'none', padding: '10px 20px', cursor: 'pointer', letterSpacing: 1 }}>返回地圖</button>
                </>
              ) : (
                <>
                  <p style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: 12, color: 'var(--text-primary)', opacity: 0.7, margin: '0 0 24px', letterSpacing: 1 }}>進入此模組開始挑戰？</p>
                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <button onClick={enterPortal} style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: 11, background: portalConfirm.accentColor, color: '#0D1B2A', border: 'none', padding: '12px 24px', cursor: 'pointer', letterSpacing: 1 }}>▶ 進入</button>
                    <button onClick={dismissPortal} style={{ fontFamily: 'var(--font-pixel), monospace', fontSize: 11, background: 'transparent', color: 'var(--text-primary)', border: '2px solid rgba(255,255,255,0.2)', padding: '12px 24px', cursor: 'pointer', letterSpacing: 1 }}>✕ 取消</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* NPC Dialogue */}
      {activeNPC && (
        <NPCDialogueBox
          npc={activeNPC}
          talkCount={npcTalkCount[activeNPC.id] ?? 0}
          onClose={closeNPC}
          onGiveFragment={(fragId) => {
            store.discoverFragment(fragId);
            closeNPC();
          }}
        />
      )}

      {/* Theory Fragment Pop */}
      {activeFragment && (
        <TheoryFragmentPop fragment={activeFragment} onDismiss={() => setActiveFragment(null)} />
      )}

      {/* Mini Encounter */}
      {activeMiniEncounter && (
        <MiniEncounterModal
          encounter={activeMiniEncounter}
          onComplete={(xp) => {
            store.completeEncounter(activeMiniEncounter.id);
            if (xp > 0) store.addXP(xp);
            setActiveMiniEncounter(null);
            encounterRef.current = false;
          }}
          onSkip={() => {
            setActiveMiniEncounter(null);
            encounterRef.current = false;
          }}
        />
      )}

      {/* Module overlay */}
      {activeModule !== null && MODULE_MAP[activeModule] && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500 }}>
          <ModulePage module={MODULE_MAP[activeModule]} onExit={closeOverlay} />
        </div>
      )}

      <style>{`
        @keyframes toastIn { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes mapItemBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      `}</style>
    </div>
  );
}
