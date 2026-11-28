import type { OrbSpread } from '@/lib/orb/orbSpreads';
import type { OrbPickedCard } from '@/lib/orbConsult';

function cardWidth(count: number): string {
  if (count <= 1) return '34%';
  if (count <= 3) return '26%';
  if (count === 4) return '22%';
  if (count <= 6) return '18%';
  if (count <= 7) return '15%';
  return '13%';
}

/** 결과창: 고른 배열 자리로 카드가 날아와 뒤집힌다. */
export function OrbSpreadReplay({
  spread,
  cards,
  onClose,
}: {
  spread: OrbSpread;
  cards: OrbPickedCard[];
  onClose: () => void;
}) {
  const width = cardWidth(cards.length);
  return (
    <div className="orb-spread-replay" role="dialog" aria-label={`${spread.name} 배열`} onClick={onClose}>
      <div className="orb-spread-sheet" onClick={event => event.stopPropagation()}>
        <p className="orb-spread-kicker">배열법</p>
        <strong>{spread.name}</strong>
        <p>{spread.reason}</p>
        <div className="orb-spread-board" aria-hidden={false}>
          {cards.map((card, index) => {
            const slot = spread.layout[index] || { x: 50, y: 50 };
            return (
              <figure
                key={`${card.number}-${index}`}
                className="orb-spread-card"
                style={{
                  ['--x' as string]: String(slot.x),
                  ['--y' as string]: String(slot.y),
                  ['--rot' as string]: `${slot.rotate || 0}deg`,
                  ['--i' as string]: String(index),
                  ['--w' as string]: width,
                }}
              >
                <div className="orb-spread-flip">
                  <span className="orb-spread-back" aria-hidden="true" />
                  <img src={card.imageUrl} alt={`${index + 1}. ${card.position} ${card.nameKo} ${card.orientationKo}`} className={card.reversed ? 'is-reversed' : ''} />
                  <em>{index + 1}</em>
                </div>
              </figure>
            );
          })}
        </div>
        <ol className="orb-spread-legend">
          {cards.map((card, index) => (
            <li key={`${card.position}-${index}`}>
              <b>{index + 1}. {card.position}</b>
              <span>{card.nameKo}</span>
              <small>{card.orientationKo}</small>
            </li>
          ))}
        </ol>
        <button type="button" className="orb-spread-close" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
