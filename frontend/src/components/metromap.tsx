"use client";
import React, { forwardRef } from 'react';

export interface MapTransform {
    scaleX: number;
    scaleY: number;
    translateX: number;
    translateY: number;
}

export interface MapControls {
    transform: MapTransform;
    isDragging: boolean;
    dragStart: (event: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => void;
    dragMove: (event: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => void;
    dragEnd: (event?: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => void;
    zoomAt: (scale: number, event: React.MouseEvent<SVGSVGElement>) => void;
    wheelZoom: (event: WheelEvent) => void;
}

interface MapProps {
    style: React.CSSProperties;
    mapGroupRef: React.RefObject<SVGGElement | null>;
    zoomFunction: MapControls;
    train: React.ReactNode;
    onMapClick?: (event: React.MouseEvent<SVGSVGElement>) => void;
}

const transformToString = ({ scaleX, scaleY, translateX, translateY }: MapTransform) =>
    `matrix(${scaleX} 0 0 ${scaleY} ${translateX} ${translateY})`;

// â”€â”€â”€ Ahmedabad Metro map data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Exact coordinates from the reference HTML map (ahemdabad.html)

interface StationData {
    id: string;
    kind: 'circle' | 'rect';
    x: number;
    y: number;
    color: string;
    label: string;
    ldx: number;
    ldy: number;
}

interface EdgeData {
    a: string;
    b: string;
    color: string;
    dashed: boolean;
}

const STATIONS: StationData[] = [
    { id: "AEC", kind: "circle", x: 289.9, y: 270.75, color: "#E4231C", label: "AEC", ldx: 6.0, ldy: 5.0 },
    { id: "AKDM", kind: "circle", x: 528.32, y: 24.76, color: "#F5D618", label: "Akshardham", ldx: 6.0, ldy: 1.0 },
    { id: "APMC", kind: "circle", x: 101.42, y: 399.15, color: "#E4231C", label: "APMC", ldx: 5.0, ldy: 5.0 },
    { id: "ARPK", kind: "circle", x: 371.09, y: 377.38, color: "#1F5CA8", label: "Apparel Park", ldx: 0.0, ldy: -6.0 },
    { id: "ARPT", kind: "circle", x: 386.08, y: 273.6, color: "#FF00A8", label: "Airport", ldx: 7.0, ldy: 2.0 },
    { id: "ARVD", kind: "circle", x: 408.69, y: 382.37, color: "#1F5CA8", label: "Amraivadi", ldx: -30.0, ldy: 10.0 },
    { id: "ASRD", kind: "circle", x: 330.49, y: 229.57, color: "#FF00A8", label: "Ashram Road", ldx: 6.0, ldy: -4.0 },
    { id: "CMSR", kind: "circle", x: 154.38, y: 327.9, color: "#1F5CA8", label: "Commerce Six Road", ldx: -56.0, ldy: 8.0 },
    { id: "DDKN", kind: "circle", x: 59.95, y: 315.64, color: "#1F5CA8", label: "Doordarshan Kendra", ldx: -50.0, ldy: 11.0 },
    { id: "DHKU", kind: "circle", x: 458.16, y: 87.44, color: "#F5D618", label: "Dholakuva Circle", ldx: 6.0, ldy: 0.0 },
    { id: "GBTU", kind: "circle", x: 559.94, y: 116.43, color: "#56CCF2", label: "Gujarat Biotechnology University", ldx: 7.0, ldy: 0.0 },
    { id: "GEKA", kind: "circle", x: 266.51, y: 348.31, color: "#1F5CA8", label: "Gheekanta", ldx: 2.0, ldy: -5.0 },
    { id: "GFTH", kind: "circle", x: 592.19, y: 124.72, color: "#56CCF2", label: "GIFT City House", ldx: 7.0, ldy: 2.0 },
    { id: "GIFC", kind: "circle", x: 600.0, y: 141.22, color: "#7B1FA2", label: "Gift City", ldx: -6.0, ldy: 12.0 },
    { id: "GJUV", kind: "circle", x: 122.15, y: 320.92, color: "#1F5CA8", label: "Gujarat University", ldx: 4.0, ldy: -4.0 },
    { id: "GKRD", kind: "circle", x: 94.19, y: 319.09, color: "#1F5CA8", label: "Gurukul Road", ldx: -4.0, ldy: -7.0 },
    { id: "GNLU", kind: "rect", x: 471.63, y: 139.43, color: "#F5D618", label: "GNLU", ldx: 4.0, ldy: -4.0 },
    { id: "GRMS", kind: "circle", x: 208.01, y: 350.22, color: "#E4231C", label: "Gandhigram", ldx: 5.0, ldy: 6.0 },
    { id: "INFC", kind: "circle", x: 445.99, y: 76.3, color: "#F5D618", label: "Infocity", ldx: 5.0, ldy: 0.0 },
    { id: "JUKB", kind: "circle", x: 441.66, y: 160.21, color: "#F5D618", label: "Juna Koba", ldx: 6.0, ldy: 5.0 },
    { id: "JUSL", kind: "circle", x: 512.33, y: 15.84, color: "#F5D618", label: "Juna Sachivalaya", ldx: 6.0, ldy: 0.0 },
    { id: "JVRJ", kind: "circle", x: 89.15, y: 386.29, color: "#E4231C", label: "Jivraj Park", ldx: -32.0, ldy: 0.0 },
    { id: "KKES", kind: "circle", x: 335.91, y: 370.2, color: "#1F5CA8", label: "Kankaria East", ldx: -42.0, ldy: 4.0 },
    { id: "KOBC", kind: "circle", x: 416.45, y: 176.15, color: "#F5D618", label: "Koba Circle", ldx: 6.0, ldy: 5.0 },
    { id: "KOBG", kind: "circle", x: 459.7, y: 150.84, color: "#F5D618", label: "Koba Gam", ldx: 6.0, ldy: 5.0 },
    { id: "KORD", kind: "rect", x: 323.88, y: 219.94, color: "#F5D618", label: "Koteshwar Road", ldx: -48.0, ldy: 0.0 },
    { id: "KPMS", kind: "circle", x: 322.2, y: 354.28, color: "#1F5CA8", label: "Kalupur Metro Station", ldx: 0.0, ldy: -6.0 },
    { id: "KTPM", kind: "circle", x: 362.59, y: 238.82, color: "#FF00A8", label: "Koteshwar Prachin Mandir", ldx: 2.0, ldy: -6.0 },
    { id: "MAHM", kind: "circle", x: 425.56, y: 7.91, color: "#F5D618", label: "Mahatama Mandir", ldx: -56.0, ldy: 0.0 },
    { id: "MTRS", kind: "circle", x: 301.19, y: 235.03, color: "#E4231C", label: "Motera Stadium", ldx: -48.0, ldy: 0.0 },
    { id: "NAMC", kind: "circle", x: 387.45, y: 187.54, color: "#F5D618", label: "Narmada Canal", ldx: 6.0, ldy: 5.0 },
    { id: "NTCR", kind: "circle", x: 510.31, y: 394.64, color: "#1F5CA8", label: "Nirant Cross Road", ldx: 0.0, ldy: -6.0 },
    { id: "OHCI", kind: "rect", x: 201.49, y: 332.99, color: "#1F5CA8", label: "Old High Court", ldx: 4.0, ldy: 8.0 },
    { id: "PDEU", kind: "circle", x: 518.41, y: 138.68, color: "#7B1FA2", label: "PDEU", ldx: -6.0, ldy: 12.0 },
    { id: "PLDI", kind: "circle", x: 186.03, y: 364.6, color: "#E4231C", label: "Paldi", ldx: 6.0, ldy: 5.0 },
    { id: "RADN", kind: "circle", x: 471.5, y: 98.79, color: "#F5D618", label: "Randesan", ldx: 6.0, ldy: 0.0 },
    { id: "RAYN", kind: "circle", x: 474.96, y: 119.76, color: "#F5D618", label: "Raysan", ldx: 6.0, ldy: 2.0 },
    { id: "RBCY", kind: "circle", x: 431.61, y: 386.24, color: "#1F5CA8", label: "Rabari Colony", ldx: -4.0, ldy: -6.0 },
    { id: "RNIP", kind: "circle", x: 225.08, y: 283.16, color: "#E4231C", label: "Ranip", ldx: 6.0, ldy: 7.0 },
    { id: "RNMS", kind: "circle", x: 99.84, y: 379.29, color: "#E4231C", label: "Rajivnagar", ldx: -31.0, ldy: -4.0 },
    { id: "SBRS", kind: "circle", x: 267.72, y: 279.76, color: "#E4231C", label: "Sabarmati Railway Station", ldx: 6.0, ldy: 7.0 },
    { id: "SBRV", kind: "circle", x: 386.91, y: 238.51, color: "#FF00A8", label: "Sabarmati River", ldx: 7.0, ldy: 2.0 },
    { id: "SDRN", kind: "circle", x: 382.4, y: 255.4, color: "#FF00A8", label: "Sardarnagar", ldx: 7.0, ldy: 2.0 },
    { id: "SEAF", kind: "circle", x: 481.14, y: 7.66, color: "#F5D618", label: "Sector-16", ldx: 6.0, ldy: 0.0 },
    { id: "SEAO", kind: "circle", x: 486.35, y: 46.22, color: "#F5D618", label: "Sector 10A", ldx: 5.0, ldy: 5.0 },
    { id: "SEBD", kind: "circle", x: 452.11, y: 0.0, color: "#F5D618", label: "Sector-24", ldx: 6.0, ldy: -3.0 },
    { id: "SEOA", kind: "circle", x: 458.22, y: 55.12, color: "#F5D618", label: "Sector-1", ldx: 7.0, ldy: 5.0 },
    { id: "SHHP", kind: "circle", x: 251.19, y: 330.33, color: "#1F5CA8", label: "Shahpur", ldx: 1.0, ldy: -5.0 },
    { id: "SHPR", kind: "circle", x: 559.76, y: 105.47, color: "#56CCF2", label: "Shahpur", ldx: 7.0, ldy: 0.0 },
    { id: "SMMS", kind: "circle", x: 286.24, y: 253.31, color: "#E4231C", label: "Sabarmati", ldx: 6.0, ldy: 5.0 },
    { id: "SPSD", kind: "circle", x: 184.08, y: 329.29, color: "#1F5CA8", label: "SP Stadium", ldx: -30.0, ldy: 9.0 },
    { id: "SRYS", kind: "circle", x: 142.04, y: 372.54, color: "#E4231C", label: "Shreyas", ldx: -22.0, ldy: -5.0 },
    { id: "SVAL", kind: "circle", x: 509.74, y: 39.04, color: "#F5D618", label: "Sachivalaya", ldx: 6.0, ldy: 3.0 },
    { id: "TAPC", kind: "circle", x: 365.91, y: 196.0, color: "#F5D618", label: "Tapovan Circle", ldx: 6.0, ldy: 5.0 },
    { id: "TLTG", kind: "circle", x: 0.0, y: 312.21, color: "#1F5CA8", label: "Thaltej Gam", ldx: -38.0, ldy: 0.0 },
    { id: "TLTJ", kind: "circle", x: 29.94, y: 312.91, color: "#1F5CA8", label: "Thaltej", ldx: 1.0, ldy: -6.0 },
    { id: "UPMS", kind: "circle", x: 194.87, y: 319.29, color: "#E4231C", label: "Usmanpura", ldx: 5.0, ldy: -2.0 },
    { id: "VDMS", kind: "circle", x: 197.59, y: 283.06, color: "#E4231C", label: "Vadaj", ldx: -21.0, ldy: 0.0 },
    { id: "VIKC", kind: "circle", x: 341.22, y: 205.81, color: "#F5D618", label: "Vishwakarma College", ldx: 6.0, ldy: 5.0 },
    { id: "VRMS", kind: "circle", x: 186.3, y: 302.14, color: "#E4231C", label: "Vijaynagar", ldx: 6.0, ldy: 2.0 },
    { id: "VSTL", kind: "circle", x: 469.92, y: 389.07, color: "#1F5CA8", label: "Vastral", ldx: 4.0, ldy: -4.0 },
    { id: "VTLG", kind: "circle", x: 538.98, y: 400.0, color: "#1F5CA8", label: "Vastral Gam", ldx: 6.0, ldy: 3.0 },
];

const EDGES: EdgeData[] = [
    { a: "VTLG", b: "NTCR", color: "#1F5CA8", dashed: false },
    { a: "NTCR", b: "VSTL", color: "#1F5CA8", dashed: false },
    { a: "VSTL", b: "RBCY", color: "#1F5CA8", dashed: false },
    { a: "RBCY", b: "ARVD", color: "#1F5CA8", dashed: false },
    { a: "ARVD", b: "ARPK", color: "#1F5CA8", dashed: false },
    { a: "ARPK", b: "KKES", color: "#1F5CA8", dashed: false },
    { a: "KKES", b: "KPMS", color: "#1F5CA8", dashed: true },
    { a: "KPMS", b: "GEKA", color: "#1F5CA8", dashed: true },
    { a: "GEKA", b: "SHHP", color: "#1F5CA8", dashed: true },
    { a: "SHHP", b: "OHCI", color: "#1F5CA8", dashed: false },
    { a: "OHCI", b: "SPSD", color: "#1F5CA8", dashed: false },
    { a: "SPSD", b: "CMSR", color: "#1F5CA8", dashed: false },
    { a: "CMSR", b: "GJUV", color: "#1F5CA8", dashed: false },
    { a: "GJUV", b: "GKRD", color: "#1F5CA8", dashed: false },
    { a: "GKRD", b: "DDKN", color: "#1F5CA8", dashed: false },
    { a: "DDKN", b: "TLTJ", color: "#1F5CA8", dashed: false },
    { a: "TLTJ", b: "TLTG", color: "#1F5CA8", dashed: false },
    { a: "APMC", b: "JVRJ", color: "#E4231C", dashed: false },
    { a: "JVRJ", b: "RNMS", color: "#E4231C", dashed: false },
    { a: "RNMS", b: "SRYS", color: "#E4231C", dashed: false },
    { a: "SRYS", b: "PLDI", color: "#E4231C", dashed: false },
    { a: "PLDI", b: "GRMS", color: "#E4231C", dashed: false },
    { a: "GRMS", b: "OHCI", color: "#E4231C", dashed: false },
    { a: "OHCI", b: "UPMS", color: "#E4231C", dashed: false },
    { a: "UPMS", b: "VRMS", color: "#E4231C", dashed: false },
    { a: "VRMS", b: "VDMS", color: "#E4231C", dashed: false },
    { a: "VDMS", b: "RNIP", color: "#E4231C", dashed: false },
    { a: "RNIP", b: "SBRS", color: "#E4231C", dashed: false },
    { a: "SBRS", b: "AEC", color: "#E4231C", dashed: false },
    { a: "AEC", b: "SMMS", color: "#E4231C", dashed: false },
    { a: "SMMS", b: "MTRS", color: "#E4231C", dashed: false },
    { a: "MTRS", b: "KORD", color: "#F5D618", dashed: false },
    { a: "KORD", b: "VIKC", color: "#F5D618", dashed: false },
    { a: "VIKC", b: "TAPC", color: "#F5D618", dashed: false },
    { a: "TAPC", b: "NAMC", color: "#F5D618", dashed: false },
    { a: "NAMC", b: "KOBC", color: "#F5D618", dashed: false },
    { a: "KOBC", b: "JUKB", color: "#F5D618", dashed: false },
    { a: "JUKB", b: "KOBG", color: "#F5D618", dashed: false },
    { a: "KOBG", b: "GNLU", color: "#F5D618", dashed: false },
    { a: "GNLU", b: "RAYN", color: "#F5D618", dashed: false },
    { a: "RAYN", b: "RADN", color: "#F5D618", dashed: false },
    { a: "RADN", b: "DHKU", color: "#F5D618", dashed: false },
    { a: "DHKU", b: "INFC", color: "#F5D618", dashed: false },
    { a: "INFC", b: "SEOA", color: "#F5D618", dashed: false },
    { a: "SEOA", b: "SEAO", color: "#F5D618", dashed: false },
    { a: "SEAO", b: "SVAL", color: "#F5D618", dashed: false },
    { a: "SVAL", b: "AKDM", color: "#F5D618", dashed: false },
    { a: "AKDM", b: "JUSL", color: "#F5D618", dashed: false },
    { a: "JUSL", b: "SEAF", color: "#F5D618", dashed: false },
    { a: "SEAF", b: "SEBD", color: "#F5D618", dashed: false },
    { a: "SEBD", b: "MAHM", color: "#F5D618", dashed: false },
    { a: "GNLU", b: "PDEU", color: "#7B1FA2", dashed: false },
    { a: "PDEU", b: "GIFC", color: "#7B1FA2", dashed: false },
    { a: "GIFC", b: "GFTH", color: "#56CCF2", dashed: false },
    { a: "GFTH", b: "GBTU", color: "#56CCF2", dashed: false },
    { a: "GBTU", b: "SHPR", color: "#56CCF2", dashed: false },
    { a: "KORD", b: "ASRD", color: "#FF00A8", dashed: false },
    { a: "ASRD", b: "KTPM", color: "#FF00A8", dashed: false },
    { a: "KTPM", b: "SBRV", color: "#FF00A8", dashed: false },
    { a: "SBRV", b: "SDRN", color: "#FF00A8", dashed: false },
    { a: "SDRN", b: "ARPT", color: "#FF00A8", dashed: true },
];

const stationIndex: Record<string, StationData> = {};
STATIONS.forEach(s => { stationIndex[s.id] = s; });

// â”€â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SvgComponent = forwardRef<SVGSVGElement, MapProps>(
    ({ style, mapGroupRef, zoomFunction, train, onMapClick }: MapProps, ref) => (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            className="metro-map"
            viewBox='-53 -24 743.74 445.16'
            preserveAspectRatio='xMidYMid meet'
            ref={ref}
            style={style}
            onTouchStart={zoomFunction.dragStart}
            onTouchMove={zoomFunction.dragMove}
            onTouchEnd={zoomFunction.dragEnd}
            onMouseDown={zoomFunction.dragStart}
            onMouseMove={zoomFunction.dragMove}
            onMouseUp={zoomFunction.dragEnd}
            onClick={onMapClick}
        >
            <g
                ref={mapGroupRef}
                transform={transformToString(zoomFunction.transform)}
            >
                {/* â”€â”€ Lines â”€â”€ */}
                <g className="lines" fill="none" strokeLinecap="round">
                    {EDGES.map((e) => {
                        const a = stationIndex[e.a];
                        const b = stationIndex[e.b];
                        if (!a || !b) return null;
                        return (
                            <line
                                key={`${e.a}-${e.b}`}
                                id={`${e.a}-${e.b}`}
                                x1={a.x}
                                y1={a.y}
                                x2={b.x}
                                y2={b.y}
                                stroke={e.color}
                                strokeWidth={4}
                                strokeDasharray={e.dashed ? '3,2.5' : undefined}
                                opacity={1}
                            />
                        );
                    })}
                </g>

                {/* â”€â”€ Stations â”€â”€ */}
                <g className="stationes">
                    {STATIONS.map((s) => (
                        <g key={s.id}>
                            {s.kind === 'circle' ? (
                                <circle
                                    cx={s.x}
                                    cy={s.y}
                                    r={5}
                                    fill="#ffffff"
                                    stroke={s.color}
                                    strokeWidth={1.3333}
                                    style={{ cursor: 'pointer' }}
                                    opacity={1}
                                />
                            ) : (
                                <rect
                                    x={s.x - 4}
                                    y={s.y - 8}
                                    width={8}
                                    height={16}
                                    rx={4}
                                    fill="#ffffff"
                                    stroke={s.color}
                                    strokeWidth={1.3333}
                                    style={{ cursor: 'pointer' }}
                                    opacity={1}
                                />
                            )}
                            <text
                                id={`lbl_${s.id}`}
                                x={s.x + s.ldx}
                                y={s.y + s.ldy}
                                fontSize={6}
                                fill="currentColor"
                                className="station-label"
                                style={{ cursor: 'pointer' }}
                                data-station-id={s.id}
                                data-station-name={s.label}
                            >
                                {s.label}
                            </text>
                        </g>
                    ))}
                </g>

                {train}
            </g>
        </svg>
    )
);

export default React.memo(SvgComponent);
