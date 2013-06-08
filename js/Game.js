// Generated by CoffeeScript 1.6.2
(function() {
  var REFRESH_RATE, TILE_SIZE, bombs, bombs_list, canvas, check_end_of_game, context, convert_num_to_time, count_bombs, discover_tile, drawBomb, drawFlag, drawWrong, draw_character, draw_down_button, draw_line, draw_square_back, draw_table, draw_up_button, explode_bomb, find_item_in_list, finished, fix_decimal, flags_list, flip_piece, flipped_list, generate_bombs, get_mouse_pos, get_neighbors, height, level, levels, mouse_pos, num_colors, set_flag, set_new_level, start_game, started, time, update_bombs, width;

  TILE_SIZE = 30;

  REFRESH_RATE = 120;

  started = false;

  finished = false;

  time = 0;

  level = 0;

  width = 0;

  height = 0;

  bombs = 0;

  bombs_list = [];

  flags_list = [];

  flipped_list = [];

  mouse_pos = {};

  levels = [
    {
      x: 8,
      y: 8,
      bombs: 10
    }, {
      x: 16,
      y: 16,
      bombs: 40
    }, {
      x: 31,
      y: 16,
      bombs: 99
    }
  ];

  num_colors = ["#0000FF", "#008040", "#FF0000", "#000080", "#800040", "#408080", "#000000", "#808080"];

  canvas = $("canvas")[0];

  context = canvas.getContext("2d");

  /*
  # Drawing Functions
  */


  draw_line = function(start_x, start_y, end_x, end_y, color, line_width) {
    context.beginPath();
    context.moveTo(start_x, start_y);
    context.lineTo(end_x, end_y);
    context.lineWidth = line_width;
    context.strokeStyle = color;
    return context.stroke();
  };

  draw_square_back = function(x, y) {
    context.beginPath();
    context.rect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    context.fillStyle = "#BDBDBD";
    return context.fill();
  };

  draw_up_button = function(x, y) {
    var line_width;

    draw_square_back(x, y);
    line_width = 3;
    draw_line(x * TILE_SIZE, y * TILE_SIZE + line_width / 2, (x + 1) * TILE_SIZE, (y * TILE_SIZE) + line_width / 2, "#FFFFFF", line_width);
    draw_line(x * TILE_SIZE + line_width / 2, y * TILE_SIZE, x * TILE_SIZE + line_width / 2, (y + 1) * TILE_SIZE, "#FFFFFF", line_width);
    draw_line((x + 1) * TILE_SIZE - line_width / 2, (y + 1) * TILE_SIZE, (x + 1) * TILE_SIZE - line_width / 2, y * TILE_SIZE, "#7B7B7B", line_width);
    return draw_line((x + 1) * TILE_SIZE, (y + 1) * TILE_SIZE - line_width / 2, x * TILE_SIZE, (y + 1) * TILE_SIZE - line_width / 2, "#7B7B7B", line_width);
  };

  draw_down_button = function(x, y) {
    var line_width;

    draw_square_back(x, y);
    line_width = 1;
    draw_line(x * TILE_SIZE, y * TILE_SIZE, (x + 1) * TILE_SIZE, y * TILE_SIZE, "#7B7B7B", line_width);
    draw_line(x * TILE_SIZE, y * TILE_SIZE, x * TILE_SIZE, (y + 1) * TILE_SIZE, "#7B7B7B", line_width);
    draw_line((x + 1) * TILE_SIZE, (y + 1) * TILE_SIZE, (x + 1) * TILE_SIZE, y * TILE_SIZE, "#7B7B7B", line_width);
    return draw_line((x + 1) * TILE_SIZE, (y + 1) * TILE_SIZE, x * TILE_SIZE, (y + 1) * TILE_SIZE, "#7B7B7B", line_width);
  };

  draw_character = function(x, y, letter, color) {
    context.beginPath();
    context.font = "bold 18pt Arial";
    context.fillStyle = color;
    context.lineWidth = 2;
    return context.fillText(letter, x * TILE_SIZE + 7, (y + 1) * TILE_SIZE - 6);
  };

  drawBomb = function(x, y) {
    context.beginPath();
    context.arc((x + 0.5) * TILE_SIZE, (y + 0.5) * TILE_SIZE, TILE_SIZE * 0.3, 0, 2 * Math.PI, false);
    context.fillStyle = "#000000";
    context.fill();
    context.moveTo((x + 0.5) * TILE_SIZE, (y + 0.05) * TILE_SIZE);
    context.lineTo((x + 0.5) * TILE_SIZE, (y + 0.95) * TILE_SIZE);
    context.moveTo((x + 0.05) * TILE_SIZE, (y + 0.5) * TILE_SIZE);
    context.lineTo((x + 0.95) * TILE_SIZE, (y + 0.5) * TILE_SIZE);
    context.moveTo((x + 0.16) * TILE_SIZE, (y + 0.16) * TILE_SIZE);
    context.lineTo((x + 0.83) * TILE_SIZE, (y + 0.83) * TILE_SIZE);
    context.moveTo((x + 0.83) * TILE_SIZE, (y + 0.16) * TILE_SIZE);
    context.lineTo((x + 0.16) * TILE_SIZE, (y + 0.83) * TILE_SIZE);
    context.lineWidth = 2;
    context.strokeStyle = "#000000";
    context.stroke();
    context.beginPath();
    context.arc((x + 0.35) * TILE_SIZE, (y + 0.35) * TILE_SIZE, TILE_SIZE * 0.1, 0, 2 * Math.PI, false);
    context.fillStyle = "#FFFFFF";
    return context.fill();
  };

  drawWrong = function(x, y) {
    context.beginPath();
    context.moveTo(x * TILE_SIZE, y * TILE_SIZE);
    context.lineTo((x + 1) * TILE_SIZE, (y + 1) * TILE_SIZE);
    context.moveTo((x + 1) * TILE_SIZE, y * TILE_SIZE);
    context.lineTo(x * TILE_SIZE, (y + 1) * TILE_SIZE);
    context.lineWidth = 2;
    context.strokeStyle = "#FF0000";
    return context.stroke();
  };

  drawFlag = function(x, y) {
    context.beginPath();
    context.moveTo((x + 0.5) * TILE_SIZE, (y + 0.5) * TILE_SIZE);
    context.lineTo((x + 0.5) * TILE_SIZE, (y + 0.9) * TILE_SIZE);
    context.lineWidth = 2;
    context.strokeStyle = "#000000";
    context.stroke();
    context.beginPath();
    context.moveTo((x + 0.55) * TILE_SIZE, (y + 0.1) * TILE_SIZE);
    context.lineTo((x + 0.55) * TILE_SIZE, (y + 0.55) * TILE_SIZE);
    context.lineTo((x + 0.1) * TILE_SIZE, (y + 0.3) * TILE_SIZE);
    context.closePath();
    context.fillStyle = "#FF0000";
    context.fill();
    context.beginPath();
    context.moveTo((x + 0.4) * TILE_SIZE, (y + 0.7) * TILE_SIZE);
    context.lineTo((x + 0.6) * TILE_SIZE, (y + 0.7) * TILE_SIZE);
    context.lineTo((x + 0.6) * TILE_SIZE, (y + 0.8) * TILE_SIZE);
    context.lineTo((x + 0.4) * TILE_SIZE, (y + 0.8) * TILE_SIZE);
    context.closePath();
    context.fillStyle = "#000000";
    context.fill();
    context.beginPath();
    context.moveTo((x + 0.3) * TILE_SIZE, (y + 0.8) * TILE_SIZE);
    context.lineTo((x + 0.7) * TILE_SIZE, (y + 0.8) * TILE_SIZE);
    context.lineTo((x + 0.7) * TILE_SIZE, (y + 0.9) * TILE_SIZE);
    context.lineTo((x + 0.3) * TILE_SIZE, (y + 0.9) * TILE_SIZE);
    context.closePath();
    context.fillStyle = "#000000";
    return context.fill();
  };

  draw_table = function() {
    var posx, posy, _i, _ref, _results;

    context.beginPath();
    context.rect(0, 0, width, height);
    context.fillStyle = "#BDBDBD";
    context.fill();
    _results = [];
    for (posx = _i = 0, _ref = levels[level].x; 0 <= _ref ? _i <= _ref : _i >= _ref; posx = 0 <= _ref ? ++_i : --_i) {
      _results.push((function() {
        var _j, _ref1, _results1;

        _results1 = [];
        for (posy = _j = 0, _ref1 = levels[level].y; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; posy = 0 <= _ref1 ? ++_j : --_j) {
          _results1.push(draw_up_button(posx, posy));
        }
        return _results1;
      })());
    }
    return _results;
  };

  /*
  # Game Functions
  */


  find_item_in_list = function(list, x, y) {
    var item, _i, _len;

    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      if (item.x === x && item.y === y) {
        return true;
      }
    }
    return false;
  };

  fix_decimal = function(num) {
    if (!(num >= 10)) {
      return "0" + num;
    }
    return num;
  };

  convert_num_to_time = function(num) {
    var hor, min, sec;

    sec = fix_decimal(Math.floor(num % 60));
    min = fix_decimal(Math.floor(num / 60));
    hor = fix_decimal(Math.floor(num / (60 * 60)));
    return hor + ":" + min + ":" + sec;
  };

  update_bombs = function() {
    if (bombs >= 0) {
      return $("#bombs").text(bombs);
    }
  };

  generate_bombs = function(x, y) {
    var new_x, new_y;

    bombs_list = [];
    bombs = 0;
    while (bombs < levels[level].bombs) {
      new_x = Math.floor(Math.random() * levels[level].x);
      new_y = Math.floor(Math.random() * levels[level].y);
      if (!(find_item_in_list(bombs_list, new_x, new_y) || (new_x === x && new_y === y))) {
        bombs_list.push({
          x: new_x,
          y: new_y
        });
        bombs++;
      }
    }
    return update_bombs();
  };

  get_mouse_pos = function(evt) {
    var rect;

    rect = canvas.getBoundingClientRect();
    return {
      x: Math.floor((evt.clientX - rect.left) / TILE_SIZE),
      y: Math.floor((evt.clientY - rect.top) / TILE_SIZE)
    };
  };

  get_neighbors = function(x, y) {
    return [
      {
        x: x - 1,
        y: y - 1
      }, {
        x: x - 1,
        y: y
      }, {
        x: x - 1,
        y: y + 1
      }, {
        x: x,
        y: y - 1
      }, {
        x: x,
        y: y + 1
      }, {
        x: x + 1,
        y: y - 1
      }, {
        x: x + 1,
        y: y
      }, {
        x: x + 1,
        y: y + 1
      }
    ];
  };

  count_bombs = function(x, y) {
    var count;

    count = 0;
    get_neighbors(x, y).map(function(tile) {
      var _ref, _ref1;

      if ((0 <= (_ref = tile.x) && _ref < levels[level].x) && (0 <= (_ref1 = tile.y) && _ref1 < levels[level].y)) {
        if (find_item_in_list(bombs_list, tile.x, tile.y)) {
          return count++;
        }
      }
    });
    return count;
  };

  flip_piece = function(x, y) {
    var is_bomb, is_flagged, is_flipped;

    if (!started) {
      started = true;
      generate_bombs(x, y);
    }
    is_flagged = find_item_in_list(flags_list, x, y);
    is_flipped = find_item_in_list(flipped_list, x, y);
    is_bomb = find_item_in_list(bombs_list, x, y);
    if (is_bomb) {
      return explode_bomb();
    } else if (!is_flagged && !is_flipped) {
      return discover_tile(x, y);
    }
  };

  discover_tile = function(x, y) {
    var count, neighbor, neighbors, _i, _len, _results;

    if ((0 <= x && x < levels[level].x) && (0 <= y && y < levels[level].y)) {
      if (!(find_item_in_list(flipped_list, x, y) || find_item_in_list(flags_list, x, y))) {
        count = count_bombs(x, y);
        draw_down_button(x, y);
        flipped_list.push({
          x: x,
          y: y
        });
        if (count === 0) {
          neighbors = get_neighbors(x, y);
          _results = [];
          for (_i = 0, _len = neighbors.length; _i < _len; _i++) {
            neighbor = neighbors[_i];
            _results.push(discover_tile(neighbor.x, neighbor.y));
          }
          return _results;
        } else {
          return draw_character(x, y, count, num_colors[count - 1]);
        }
      }
    }
  };

  explode_bomb = function() {
    finished = true;
    $(".message").text("You just exploded!");
    $(".message").addClass("loose");
    $(".message").show();
    bombs_list.map(function(bomb) {
      if (!find_item_in_list(flags_list, bomb.x, bomb.y)) {
        draw_down_button(bomb.x, bomb.y);
        return drawBomb(bomb.x, bomb.y);
      }
    });
    return flags_list.map(function(flag) {
      if (!find_item_in_list(bombs_list, flag.x, flag.y)) {
        draw_up_button(flag.x, flag.y);
        drawBomb(flag.x, flag.y);
        return drawWrong(flag.x, flag.y);
      }
    });
  };

  set_flag = function(x, y) {
    var flag, temp, _i, _len;

    if (find_item_in_list(flags_list, x, y)) {
      temp = [];
      for (_i = 0, _len = flags_list.length; _i < _len; _i++) {
        flag = flags_list[_i];
        if (!(flag.x === x && flag.y === y)) {
          temp.push(flag);
        }
      }
      flags_list = temp;
      draw_up_button(x, y);
      bombs++;
    } else {
      if (flags_list.length < levels[level].bombs) {
        if (!find_item_in_list(flipped_list, x, y)) {
          flags_list.push({
            x: x,
            y: y
          });
          drawFlag(x, y);
          bombs--;
        }
      }
    }
    return update_bombs();
  };

  check_end_of_game = function() {
    if (flags_list.length === bombs_list.length) {
      flags_list.map(function(flag) {
        if (!find_item_in_list(bombs_list, flag.x, flag.y)) {
          return false;
        }
      });
      return true;
    } else {
      return false;
    }
  };

  set_new_level = function(val) {
    level = val;
    width = levels[level].x * TILE_SIZE;
    height = levels[level].y * TILE_SIZE;
    bombs = levels[level].bombs;
    canvas.width = width;
    canvas.height = height;
    draw_table();
    return start_game();
  };

  start_game = function() {
    started = false;
    finished = false;
    time = 0;
    bombs_list = [];
    flags_list = [];
    flipped_list = [];
    draw_table();
    $(".message").text("");
    $(".message").removeClass("win");
    $(".message").removeClass("loose");
    $(".message").hide();
    $("#time").text(convert_num_to_time(time));
    return update_bombs();
  };

  $(document).ready(function() {
    $("#levelBtn").on("click", function() {
      level = $("#levelSel").val();
      return set_new_level(level);
    });
    $('canvas').on('contextmenu', function(event) {
      event.preventDefault();
      mouse_pos = get_mouse_pos(event);
      set_flag(mouse_pos.x, mouse_pos.y);
      finished = check_end_of_game();
      if (finished) {
        $(".message").text("You WON!");
        $(".message").addClass("win");
        return $(".message").show();
      }
    });
    $("canvas").on('click', function(event) {
      event.preventDefault();
      mouse_pos = get_mouse_pos(event);
      if (!finished) {
        return flip_piece(mouse_pos.x, mouse_pos.y);
      }
    });
    set_new_level(0);
    return setInterval(function() {
      if (!finished) {
        time++;
        return $("#time").text(convert_num_to_time(time));
      }
    }, 1000);
  });

}).call(this);
