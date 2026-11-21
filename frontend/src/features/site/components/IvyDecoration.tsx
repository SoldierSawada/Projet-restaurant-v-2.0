import { cn } from '@/shared/lib/cn'

const leafPath =
  'M0 0 C14 -26 44 -30 62 -10 C54 -4 60 6 50 10 C56 22 40 28 30 20 C26 34 8 32 4 20 C-10 22 -20 10 -14 2 C-6 -2 -4 -2 0 0Z'

const leafTransforms = [
  'translate(72 900) rotate(-30) scale(1.1)',
  'translate(38 760) rotate(200) scale(0.9)',
  'translate(96 600) rotate(-20) scale(1.2)',
  'translate(52 430) rotate(190) scale(1)',
  'translate(118 260) rotate(-40) scale(1)',
  'translate(100 90) rotate(-70) scale(0.8)',
]

const grapeCenters: Array<[number, number]> = [
  [0, 0],
  [12, 4],
  [-10, 6],
  [4, 14],
  [-6, 18],
  [10, 20],
]

type IvyBranchProps = {
  side: 'left' | 'right'
}

function IvyBranch({ side }: IvyBranchProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="260"
      height="1000"
      viewBox="0 0 260 1000"
      fill="none"
      className={cn(
        'pointer-events-none absolute top-24 hidden text-bordeaux opacity-40 xl:block dark:opacity-15',
        side === 'left' ? 'left-0' : 'right-0',
      )}
    >
      <g transform={side === 'right' ? 'translate(260 0) scale(-1 1)' : undefined}>
        <path
          d="M60 1000 C120 820 20 650 80 470 S170 180 120 0"
          stroke="currentColor"
          strokeWidth={4}
          strokeLinecap="round"
        />
        <path
          d="M80 470 c-20 -10 -30 -2 -28 10 c2 10 12 10 14 4"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <path d="M100 250 c18 -8 28 0 26 12" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
        <g fill="currentColor">
          {leafTransforms.map((transform) => (
            <path key={transform} transform={transform} d={leafPath} />
          ))}
          <g transform="translate(150 360)">
            {grapeCenters.map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={7} />
            ))}
          </g>
        </g>
      </g>
    </svg>
  )
}

export function IvyDecoration() {
  return (
    <>
      <IvyBranch side="left" />
      <IvyBranch side="right" />
    </>
  )
}
