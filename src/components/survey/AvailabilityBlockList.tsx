import { AvailabilityBlockRow, type AvailabilityBlockState } from './AvailabilityBlockRow'
import styles from './Survey.module.css'

export function AvailabilityBlockList({
  blocks,
  onChangeBlock,
  onRemoveBlock,
  onAddBlock,
}: {
  blocks: AvailabilityBlockState[]
  onChangeBlock: (id: number, patch: Partial<Omit<AvailabilityBlockState, 'id'>>) => void
  onRemoveBlock: (id: number) => void
  onAddBlock: () => void
}) {
  return (
    <>
      <div>
        {blocks.map((block) => (
          <AvailabilityBlockRow
            key={block.id}
            block={block}
            onChange={(patch) => onChangeBlock(block.id, patch)}
            onRemove={() => onRemoveBlock(block.id)}
          />
        ))}
      </div>

      <button type="button" className={styles.addTime} onClick={onAddBlock}>
        Add another time
      </button>
    </>
  )
}
