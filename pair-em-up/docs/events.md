# EventBus Events - Pair'em Up

## UI Events
- `ui:start` - { mode: 'classic' | 'random' | 'chaotic' }
- `ui:cell:click` - { index: number }
- `ui:matched` - { indexes: [i1, i2] }
- `ui:unmatched` - { indexes: [i1, i2] }
- `ui:assist:use` - { name: 'hints' | 'revert' | 'addNumbers' | 'shuffle' | 'eraser' }

- `ui:save` — {}
- `ui:continue` - {}
- `ui:back` - {}

## Game Events
- `game:tryPair` - { firstIndex, secondIndex }
- `game:pair:success` - { firstIndex, secondIndex, points, newScore }
- `game:pair:fail` - { firstIndex, secondIndex }
- `game:win` - { score, elapsedMs }
- `game:lose` - { reason }

## Storage Events
- `storage:saved` - { timestamp }
- `storage:loaded` - { state }

---

## Payload Examples

- `ui:start` - { mode: 'classic' }
- `game:pair:success` - { firstIndex: 5, secondIndex: 14, points: 2, newScore: 12 }
- `game:lose` - { reason: 'no moves' }
