#!/usr/bin/env python3
"""Rebake the landing portraits' play order: the ink-delta morph tour.

Usage:      python3 scripts/bake-portrait-tour.py [--exclude 17,23]
Input:      public/assets/ascii-portraits/ascii-art (N).txt — 55 lines
            each, any width; content is centered onto a 55x100 grid.
Output:     the closed-chain play order + its stats; the numbers land in
            src/components/LandingAbout.tsx's PORTRAIT_NUMBERS by hand.

Method: ink-density buckets per cell (0 paper, 1 light glyphs, 2 medium
dither, 3 dense fills), pair cost = total bucket delta / cells, then
greedy nearest-neighbour from every start + 2-opt into a closed chain,
the wrap included. A rotation anchor at 1 keeps the written list
readable; the closure makes cost rotation-invariant.
"""
import argparse, glob, re

LIGHT = set(".,:;'\"`-_=|/\\*ilI1!¡¿¦¨ªº°¹²³«»‹›…¶·")
MID = set('≈×÷√π±≠§©¬')

def bucket(c):
    if c == ' ':
        return 0
    if c in LIGHT:
        return 1
    o = ord(c)
    if o < 0x80:
        return 2
    if c in MID:
        return 2
    return 3

GRID_W, GRID_H = 100, 55

def matrix(text):
    rows = [l.rstrip() for l in text.splitlines()[:GRID_H]]
    xs = [i for l in rows for i, c in enumerate(l) if c != ' ']
    if not xs:
        return [[0] * GRID_W for _ in range(GRID_H)]
    lo, hi = min(xs), max(xs)
    shift = (GRID_W - (hi - lo + 1)) // 2 - lo
    m = [[0] * GRID_W for _ in range(GRID_H)]
    for y, l in enumerate(rows):
        lane = m[y]
        for x, c in enumerate(l):
            gx = x + shift
            if 0 <= gx < GRID_W:
                lane[gx] = bucket(c)
    return m

def flat(m):
    return [v for row in m for v in row]

ap = argparse.ArgumentParser()
ap.add_argument('--exclude', default='', help='frame numbers left off the tour (still on disk)')
args = ap.parse_args()
excluded = {int(x) for x in args.exclude.split(',') if x.strip()}

files = sorted(glob.glob('public/assets/ascii-portraits/*.txt'),
               key=lambda p: int(re.search(r'\((\d+)\)', p).group(1)))
files = [f for f in files
         if int(re.search(r'\((\d+)\)', f).group(1)) not in excluded]
nums = [int(re.search(r'\((\d+)\)', f).group(1)) for f in files]
print('frames:', nums, flush=True)

F = [flat(matrix(open(f, encoding='utf-8').read())) for f in files]
n = len(F)
CELLS = GRID_W * GRID_H

cost = [[sum(abs(a - b) for a, b in zip(F[i], F[j])) / CELLS
         for j in range(n)] for i in range(n)]

def tour_len(order):
    return sum(cost[order[k]][order[(k + 1) % n]] for k in range(n))

num_len = tour_len(list(range(n)))
print(f'numeric avg delta/cell: {num_len/n:.5f}', flush=True)

def greedy(seed):
    unvis = set(range(n)); unvis.discard(seed)
    tour = [seed]
    while unvis:
        last = tour[-1]
        nxt = min(unvis, key=lambda j: cost[last][j])
        tour.append(nxt); unvis.discard(nxt)
    return tour

def two_opt(tour):
    best = tour[:]
    improved = True
    while improved:
        improved = False
        for i in range(n):
            # i=0 with j=n-1 reverses the WHOLE closed tour; the two
            # boundary edges are the same wrap edge twice, so the delta
            # test reads 0 < 2*wrap and loops forever — skip that pair.
            jmax = n - 1 if i == 0 else n
            for j in range(i + 2, jmax):
                a, b, c, d = best[i - 1], best[i], best[j], best[(j + 1) % n]
                if cost[a][c] + cost[b][d] < cost[a][b] + cost[c][d] - 1e-12:
                    best[i:j + 1] = best[i:j + 1][::-1]
                    improved = True
                    break  # the sweep restarts from the fresh tour
    return best

best_tour, best_len = None, float('inf')
for s in range(n):
    t = two_opt(greedy(s))
    L = tour_len(t)
    if L < best_len:
        best_tour, best_len = t, L

print(f'TOUR avg delta/cell: {best_len/n:.5f}  (down '
      f'{(1 - best_len/num_len)*100:.1f}% vs numeric)', flush=True)
tour_nums = [nums[i] for i in best_tour]
# rotate so the loop starts at frame 1 (or its nearest kept neighbor);
# a closed tour's edges are rotation-invariant, only the read changes
start = tour_nums.index(min(tour_nums))
tour_nums = tour_nums[start:] + tour_nums[:start]
idx = [nums.index(num) for num in tour_nums]
print('TOUR ORDER:', tour_nums, flush=True)
steps = [cost[idx[k]][idx[(k + 1) % n]] for k in range(n)]
print('per-step delta/cell:', [round(s, 3) for s in steps], flush=True)
beats = [(round(s, 3), f'{tour_nums[k]}->{tour_nums[(k + 1) % n]}')
         for k, s in enumerate(steps) if s > 0.55]
print('beats >0.55:', beats, flush=True)
