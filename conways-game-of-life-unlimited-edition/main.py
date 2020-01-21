import time
import random


class Grid:
    def __init__(self, grid):
        self._grid = grid

    def _size(self):
        if len(self._grid) == 0:
            return (0, 0)
        return (len(self._grid[0]), len(self._grid))

    def drain(self):
        prev_ptr = self._grid
        if sum(self._grid[0]) == 0:
            self._grid = self._grid[1:]
        if sum(self._grid[-1]) == 0:
            self._grid = self._grid[:-1]
        if sum(row[0] for row in self._grid) == 0:
            self._grid = [row[1:] for row in self._grid]
        if sum(row[-1] for row in self._grid) == 0:
            self._grid = [row[:-1] for row in self._grid]
        if prev_ptr != self._grid:
            self.drain()

    def at(self, x, y):
        w, h = self._size()
        if (x < 0 or x >= w) or (y < 0 or y >= h):
            return 0
        return self._grid[y][x]

    def memb(self, x, y):
        _map = [(-1, -1), (0, -1), (1, -1),
                (-1, 0), (1, 0),
                (-1, 1), (0, 1), (1, 1)]
        return sum(self.at(x + coor[0], y + coor[1]) for coor in _map)

    def generation(self):
        w, h = self._size()
        new_lst = (
            [[0] * (w + 2)] +
            [[0] + row[:] + [0] for row in self._grid] +
            [[0] * (w + 2)])
        for y in range(h + 2):
            for x in range(w + 2):
                new_lst[y][x] = self.desi(
                    self.at(x - 1, y - 1), self.memb(x - 1, y - 1))
        self._grid = new_lst
        self.drain()

    def desi(self, cell, cnt):
        if cell:
            if (cnt < 2) or (cnt > 3):
                return 0
            else:
                return 1
        else:
            if cnt == 3:
                return 1
            else:
                return cell

    def memb_matrix(self):
        w, h = self._size()
        res = []
        for y in range(h):
            row = []
            for x in range(w):
                row.append(self.memb(x, y))
            res.append(row)
        return '\n'.join(
            ''.join(str(cell).ljust(2) for cell in row)
            for row in res
        )

    def __repr__(self):
        return '\n'.join(
            ''.join('▓▓' if cell else '░░' for cell in row)
            for row in self._grid
        )

    # def print_framed(self):
    #     h = len(self._grid)
    #     print(self.__repr__() + f'\n\033[{h + 1}A')


def get_generation(cells, generations):
    grid = Grid(cells)
    for _ in range(generations):
        grid.generation()
    return grid._grid


grid = Grid([[1, 0, 0],
             [0, 1, 1],
             [1, 1, 0]])
# w, _ = grid._size()
# grid._grid = (
#     [[0] * (w + 2)] +
#     [[0] + row[:] + [0] for row in grid._grid] +
#     [[0] * (w + 2)])
# print(grid.memb_matrix())

# W, H = 20, 20
# grid = Grid([[random.choice([0, 1]) for _ in range(W)] for _ in range(H)])
for i in range(20):
    print(grid)
    input()
    grid.generation()
