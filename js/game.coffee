# Constants
TILE_SIZE = 30
REFRESH_RATE = 120 # ms

# global variables
running = false
exploded = false
won = false

time = level = width = height = bombs = 0

bombs_list = []
flags_list = []
flipped_list = []

mouse_pos = {}

# define number of columns, rows and bombs for 3 levels: easy, normal and hard
levels = [{x: 8, y: 8, bombs: 10}, {x: 16, y: 16, bombs: 40}, {x: 31, y: 16, bombs: 99}]

# define colors for numbers (from 1 to 8) that shows the number of neighbors that are bombs
num_colors = ["#0000FF", "#008040", "#FF0000", "#000080", "#800040", "#408080", "#000000", "#808080"]

###
# Drawing Functions
###



# calculates all neighbors' positions
get_neighbors = (x, y) ->
  [
    { x: x - 1, y: y - 1}
    { x: x - 1, y: y}
    { x: x - 1, y: y + 1}
    { x: x, y: y - 1}
    { x: x, y: y + 1}
    { x: x + 1, y: y - 1}
    { x: x + 1, y: y}
    { x: x + 1, y: y + 1}
  ]


canvas = $("canvas")[0]
context = canvas.getContext "2d"
