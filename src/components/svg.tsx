import type { FC, SVGAttributes } from 'react';

import { range } from '../util';

const TAU = 2 * Math.PI;

const polarToCartesian = (r: number, theta: number): [number, number] => [
    r * Math.sin(theta),
    -r * Math.cos(theta),
];

export const Star: FC<
    Omit<SVGAttributes<SVGPathElement>, 'd' | 'points'> &
    {
        points: number,
        r1: number,
        r2: number,
    }
> = ({
    points,
    r1,
    r2,
    ...rest
}) => {
    const parts = Array.from(range(0, points)).flatMap(i => [
        polarToCartesian(r2, i * TAU/points),
        polarToCartesian(r1, (i + 0.5) * TAU/points),
    ]);

    const d = `M ${parts[0]} L ${parts.slice(1).join(' ')} Z`;

    return <path d={d} {...rest} />;
};
