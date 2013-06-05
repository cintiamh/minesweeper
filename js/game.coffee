# Constants
TILE_SIZE = 30
REFRESH_RATE = 120 # ms

# global variables
running = false
exploded = false
won = false

time = 0
level = 0
width = 0
height = 0
bombs = 0

bombs_list = []
flags_list = []
flipped_list = []

mouse_pos = {}

# define number of columns, rows and bombs for 3 levels: easy, normal and hard
levels = [{x: 8, y: 8, bombs: 10}, {x: 16, y: 16, bombs: 40}, {x: 31, y: 16, bombs: 99}]

# define colors for numbers (from 1 to 8) that shows the number of neighbors that are bombs
num_colors = ["#0000FF", "#008040", "#FF0000", "#000080", "#800040", "#408080", "#000000", "#808080"]

# HTML5 canvas instantiation
canvas = $("canvas")[0]
context = canvas.getContext "2d"

###
# Drawing Functions
###

# Draw a generic line
draw_line = (start_x, start_y, end_x, end_y, color, line_width) ->
  context.beginPath()
  context.moveTo(start_x, start_y)
  context.lineTo(end_x, end_y)
  context.lineWidth = line_width
  context.strokeStyle = color
  context.stroke()

# Draw an empty square
draw_square_back = (x, y) ->
  context.beginPath()
  context.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
  context.fillStyle = "#BDBDBD"
  context.fill()

# Draw an innactivated square
draw_up_button = (x, y) ->
  # Draws the gray square (background)
  draw_square_back(x, y)
  line_width = 3
  # Draw the tile's shadows to give the 3D effect
  draw_line(x * TILE_SIZE, y * TILE_SIZE + line_width / 2, (x + 1) * TILE_SIZE, (y * TILE_SIZE) + line_width / 2, "#FFFFFF", line_width)
  draw_line(x * TILE_SIZE + line_width / 2, y * TILE_SIZE, x * TILE_SIZE + line_width / 2, (y + 1) * TILE_SIZE, "#FFFFFF", line_width)
  draw_line((x + 1) * TILE_SIZE - line_width / 2, (y + 1) * TILE_SIZE, (x + 1) * TILE_SIZE - line_width / 2, y * TILE_SIZE, "#7B7B7B", line_width)
  draw_line((x + 1) * TILE_SIZE, (y + 1) * TILE_SIZE - line_width / 2, x * TILE_SIZE, (y + 1) * TILE_SIZE - line_width / 2, "#7B7B7B", line_width)

# Draw an clicked square
draw_down_button = (x, y) ->
  # Draws the gray square (background)
  draw_square_back(x, y)
  line_width = 1
  draw_line(x * TILE_SIZE, y * TILE_SIZE, (x + 1) * TILE_SIZE, y * TILE_SIZE, "#7B7B7B", line_width)
  draw_line(x * TILE_SIZE, y * TILE_SIZE, x * TILE_SIZE, (y + 1) * TILE_SIZE, "#7B7B7B", line_width)
  draw_line((x + 1) * TILE_SIZE, (y + 1) * TILE_SIZE, (x + 1) * TILE_SIZE, y * TILE_SIZE, "#7B7B7B", line_width)
  draw_line((x + 1) * TILE_SIZE, (y + 1) * TILE_SIZE, x * TILE_SIZE, (y + 1) * TILE_SIZE, "#7B7B7B", line_width)

# "Draws" the letter inside a square with the specified color
draw_character = (x, y, letter, color) ->
  context.beginPath()
  context.font = "bold 18pt Arial"
  context.fillStyle = color
  context.lineWidth = 2
  context.fillText(letter, x * TILE_SIZE + 7, (y + 1) * TILE_SIZE - 6)

# draw the bomb image
drawBomb = (x, y) ->
  # the bomb circle
  context.beginPath()
  context.arc((x + 0.5) * TILE_SIZE, (y + 0.5) * TILE_SIZE, TILE_SIZE * 0.3, 0, 2 * Math.PI, false)
  context.fillStyle = "#000000"
  context.fill()
  # draw the spikes
  context.moveTo((x + 0.5) * TILE_SIZE, (y + 0.05) * TILE_SIZE)
  context.lineTo((x + 0.5) * TILE_SIZE, (y + 0.95) * TILE_SIZE)
  context.moveTo((x + 0.05) * TILE_SIZE, (y + 0.5) * TILE_SIZE)
  context.lineTo((x + 0.95) * TILE_SIZE, (y + 0.5) * TILE_SIZE)
  context.moveTo((x + 0.16) * TILE_SIZE, (y + 0.16) * TILE_SIZE)
  context.lineTo((x + 0.83) * TILE_SIZE, (y + 0.83) * TILE_SIZE)
  context.moveTo((x + 0.83) * TILE_SIZE, (y + 0.16) * TILE_SIZE)
  context.lineTo((x + 0.16) * TILE_SIZE, (y + 0.83) * TILE_SIZE)
  context.lineWidth = 2
  context.strokeStyle = "#000000"
  context.stroke()
  # highlight on the top corner
  context.beginPath()
  context.arc((x + 0.35) * TILE_SIZE, (y + 0.35) * TILE_SIZE, TILE_SIZE * 0.1, 0, 2 * Math.PI, false)
  context.fillStyle = "#FFFFFF"
  context.fill()

# Draw the red X on top of the square
drawWrong = (x, y) ->
  context.beginPath()
  context.moveTo(x * TILE_SIZE, y * TILE_SIZE)
  context.lineTo((x + 1) * TILE_SIZE, (y + 1) * TILE_SIZE)
  context.moveTo((x + 1) * TILE_SIZE, y * TILE_SIZE)
  context.lineTo(x * TILE_SIZE, (y + 1) * TILE_SIZE)
  context.lineWidth = 2
  context.strokeStyle = "#FF0000"
  context.stroke()

# Draw the flag on a Square
drawFlag = (x, y) ->
  context.beginPath()
  context.moveTo((x + 0.5) * TILE_SIZE, (y + 0.5) * TILE_SIZE)
  context.lineTo((x + 0.5) * TILE_SIZE, (y + 0.9) * TILE_SIZE)
  context.lineWidth = 2
  context.strokeStyle = "#000000"
  context.stroke()
  # drawing the triangle
  context.beginPath()
  context.moveTo((x + 0.55) * TILE_SIZE, (y + 0.1) * TILE_SIZE)
  context.lineTo((x + 0.55) * TILE_SIZE, (y + 0.55) * TILE_SIZE)
  context.lineTo((x + 0.1) * TILE_SIZE, (y + 0.3) * TILE_SIZE)
  context.closePath()
  context.fillStyle = "#FF0000"
  context.fill()
  #drawing flag base
  context.beginPath()
  context.moveTo((x + 0.4) * TILE_SIZE, (y + 0.7) * TILE_SIZE)
  context.lineTo((x + 0.6) * TILE_SIZE, (y + 0.7) * TILE_SIZE)
  context.lineTo((x + 0.6) * TILE_SIZE, (y + 0.8) * TILE_SIZE)
  context.lineTo((x + 0.4) * TILE_SIZE, (y + 0.8) * TILE_SIZE)
  context.closePath()
  context.fillStyle = "#000000"
  context.fill()
  context.beginPath()
  context.moveTo((x + 0.3) * TILE_SIZE, (y + 0.8) * TILE_SIZE)
  context.lineTo((x + 0.7) * TILE_SIZE, (y + 0.8) * TILE_SIZE)
  context.lineTo((x + 0.7) * TILE_SIZE, (y + 0.9) * TILE_SIZE)
  context.lineTo((x + 0.3) * TILE_SIZE, (y + 0.9) * TILE_SIZE)
  context.closePath()
  context.fillStyle = "#000000"
  context.fill()

# draw the whole clean table
draw_table = ->
  context.beginPath()
  context.rect(0, 0, width, height)
  context.fillStyle = "#BDBDBD"
  context.fill()
  # draw grid
  for posx in [0..levels[level].x]
    for posy in [0..levels[level].y]
      draw_up_button(posx, posy)

###
# Game Functions
###

find_item_in_list = (list, x, y) ->
  for item in list
    if item.x == x and item.y == y
      return true
  return false

update_bombs = ->
  if bombs >= 0
    $("#bombs").text(bombs)

# Generate bombs in random positions
generate_bombs = (x, y) ->
  bombs_list = []
  bombs = 0
  while bombs < levels[level].bombs
    new_x = Math.floor(Math.random() * levels[level].x)
    new_y = Math.floor(Math.random() * levels[level].y)
    # unless the new coordinates are new and are not the first click pos, add new bomb to list
    unless find_item_in_list(bombs_list, new_x, new_y) or (new_x == x and new_y == y)
      bombs_list.push({x: new_x, y: new_y})
      bombs++
  update_bombs()

# Get the mouse position inside the canvas
getMousePos = (canvas, evt) ->
  rect = canvas.getBoundingClientRect()
  {x: Math.floor((evt.clientX - rect.left) / TILE_SIZE), y: Math.floor((evt.clientY - rect.top) / TILE_SIZE)}

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

# transform 1 digit number into string with 2 digits
fix_decimal = (num) ->
  unless num >= 10
    return "0" + num
  num

# converts the number of seconds into clock display HH:mm:ss
convert_num_to_time = (num) ->
  sec = fix_decimal(Math.floor(num % 60))
  min = fix_decimal(Math.floor(num / 60))
  hor = fix_decimal(Math.floor(num / (60 * 60)))
  return hor + ":" + min + ":" + sec

# set all the level dependent variables and resizes canvas
set_new_level = (val) ->
  level = val
  width = levels[level].x * TILE_SIZE
  height = levels[level].y * TILE_SIZE
  bombs = levels[level].bombs
  canvas.width = width
  canvas.height = height

start_game = () ->
  running = true
  exploded = false
  won = false
  time = 0
  draw_table()
  $(".message").text("")
  $("#time").text(convert_num_to_time(time))
  update_bombs()

$('canvas').mousedown((event) ->
  # left click
  if event.which == 1
    console.log "left click"

  # right click
  else if event.which == 3
    console.log "right click"

)

set_new_level(0)
start_game()
