/* eslint-disable prefer-spread */
// Define the shape of a point. 
// y is optional because commands like 'H' (horizontal) only use x.
export interface PathPoint {
    x: number;
    y?: number;
}

// Specific interface for Angle calculation where both X and Y are required
export interface Point2D {
    x: number;
    y: number;
}

// The structure returned by the parse function
export interface ParsedPathData {
    operators: string[];
    points: PathPoint[];
}

type PathCommand = (...args: number[]) => string;

const pathCommands = {
    // uppercase (M) - absolute coordinates, lowercase (m) - relative coordinates
    M: (x: number, y: number): string => `M${x},${y}`,
    m: (x: number, y: number): string => `m${x},${y}`,
    L: (x: number, y: number): string => `L${x},${y}`,
    l: (x: number, y: number): string => `l${x},${y}`,
    H: (x: number): string => `H${x}`,
    h: (x: number): string => `h${x}`,
    V: (y: number): string => `V${y}`,
    v: (y: number): string => `v${y}`,
    C: (x1: number, y1: number, x2: number, y2: number, x: number, y: number): string => `C${x1},${y1} ${x2},${y2} ${x},${y}`,
    c: (x1: number, y1: number, x2: number, y2: number, x: number, y: number): string => `c${x1},${y1} ${x2},${y2} ${x},${y}`,
    S: (x2: number, y2: number, x: number, y: number): string => `S${x2},${y2} ${x},${y}`,
    s: (x2: number, y2: number, x: number, y: number): string => `s${x2},${y2} ${x},${y}`,
    Q: (x1: number, y1: number, x: number, y: number): string => `Q${x1},${y1} ${x},${y}`,
    q: (x1: number, y1: number, x: number, y: number): string => `q${x1},${y1} ${x},${y}`,
    T: (x: number, y: number): string => `T${x},${y}`,
    t: (x: number, y: number): string => `t${x},${y}`,
    Z: (): string => 'Z',
    z: (): string => 'z',
} satisfies Record<string, PathCommand>;

type PathOperator = keyof typeof pathCommands;

const getPathCommand = (key: string): PathCommand | undefined =>
    Object.prototype.hasOwnProperty.call(pathCommands, key)
        ? pathCommands[key as PathOperator]
        : undefined;

const SVGPathUtils = {
    ...pathCommands,
    angle: (p1: Point2D, p2: Point2D): number => {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
    },

    parse: (d: string): ParsedPathData => {
        const operators = d.replace(/[\d,\-\s.]+/g, '').split('');
        const points: PathPoint[] = [];
        const nums = d.replace(/[A-Za-z,]+/g, ' ').trim().replace(/\s\s+/g, ' ').split(' ');

        let i = -1;

        operators.forEach((key) => {
            const f = getPathCommand(key);

            if (typeof f === 'function') {
                if (f.length === 1) {
                    points.push({ x: +nums[++i] });
                } else {
                    // f.length is the number of arguments the command function takes.
                    // We loop through half the length (coordinate pairs)
                    const l = f.length / 2;
                    for (let j = -1; ++j < l;) {
                        points.push({ x: +nums[++i], y: +nums[++i] });
                    }
                }
            }
        });

        return { operators, points };
    },

    generate: (data: ParsedPathData): string => {
        const p = [...data.points]; // Clone to avoid mutation
        const str: string[] = [];

        data.operators.forEach((key) => {
            const f = getPathCommand(key);

            if (typeof f === 'function') {
                const args: number[] = [];
                if (f.length === 1) {
                    const point = p.shift();
                    if (point) args.push(point.x);
                } else {
                    const l = f.length / 2;
                    for (let i = -1; ++i < l;) {
                        const point = p.shift();
                        if (point) args.push(point.x, point.y!);
                    }
                }
                str.push(f.apply(null, args));
            }
        });

        return str.join(' ');
    },

    inversePath: (d: string): string => {
        const data = SVGPathUtils.parse(d);
        const reversedOperators = [...data.operators].reverse();
        const reversedPoints = [...data.points].reverse();
        const firstOperator = reversedOperators.pop();
        const closePathOperator = reversedOperators[0]?.toLowerCase() === 'z'
            ? reversedOperators.shift()
            : undefined;

        const ro = [
            ...(firstOperator ? [firstOperator] : []),
            ...reversedOperators,
            ...(closePathOperator ? [closePathOperator] : []),
        ];

        return SVGPathUtils.generate({ operators: ro, points: reversedPoints });
    },

    join: (...args: string[]): string | undefined => {
        if (!args.length) return;
        return args.join(' ');
    }
};

export default SVGPathUtils;
