#!/usr/bin/env python3
#coding=utf8
from pygnuplot import gnuplot
import re
import pandas as pd

LOADS = "./loads.log"
TIMES = "./times.log"

lines = []
with open(LOADS, "r") as f_loads, open(TIMES, "r") as f_times:
    for loads_line, times_line in zip(f_loads, f_times):
        lines.append(loads_line.strip() + " " + times_line.strip())

csv = []
for line in lines:
    stmts_match = re.search(r"Load:\s*(\d+)", line)
    stmts = int(stmts_match.group(1)) if stmts_match else None

    elapsed_match = re.search(r"Total elapsed=(\d+)ms", line)
    elapsed = int(elapsed_match.group(1)) if elapsed_match else None

    csv.append({"stmts": stmts, "elapsed":elapsed})

total_stmts = sum(item['stmts'] for item in csv)
total_times = sum(item['elapsed'] for item in csv)/1000/60/60


g = gnuplot.Gnuplot(log = True)

g.set(terminal = 'pngcairo enhanced font "arial,8" fontscale 1.0 size 800, 600 ',
      output = '"ingestion.png"',
      style = ["fill transparent solid 0.50 noborder", "data lines", "function filledcurves y1=0"],
      multiplot = True,)


df = pd.DataFrame(csv)


g.plot_data(df,
            f'using 0:($2/100000) title "total: {total_stmts:,} statements" with lines lt 2',
            size = '1, 0.5',
            origin = '0, 0.5',
            xrange = f'[0:{len(csv)}]',
            ylabel = '"number of statements (x10^5)"',
            format = 'x ""')

g.plot_data(df,
            f'using 0:($3/1000) title "total: {"{:.1f}".format(total_times)}h" with lines lt 2',
            size = '1, 0.5',
            origin = '0, 0',
            xrange = f'[0:{len(csv)}]',
            ylabel = '"ingestion time (s)"',
            xlabel = '"n^{th} ingested file"',
            format = ["x"])
