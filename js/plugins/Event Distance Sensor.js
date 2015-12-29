// ----------------------------------------------------------------
// Event Distance Sensor.js
// With Camera Scroll EX Compatibility
// ----------------------------------------------------------------
/*:
* @plugindesc v2.0 Creates event actions based on their distance to the character.
* @author: Soulpour777
* @help
* Event Distance Sensor Documentation
* 
Q: How do I set up an event that can do sensor abilities?
A: You have to place the <action> on the event's first page
as a comment. Make sure that it is a comment and make sure
you are in the first page. You have to place what is the
range of the sensor as well or else it won't work.

For example, you want an event to sense you if you
are near the event, you can use:

<action>
<sensor: 4>

This means that when you're 4 blocks away the event,
the event would detect you right away, and move to
where it wants to.

If you place the sensor at 2, you need to get near
the event so much before it works.

You can also set which page you want to activate
in the sensor if you don't want it to be Self
Switch A.

To do it, do this in a plugin command:

setSensorPage selfswitchLetter

where selfswitchLetter is the letter of
the Self Switch you want to activate.

For example:

setSensorPage A 

Q: So after I set it up as a sensor event, how can I make
it do what I want?
A: You have to create a second page of your event. The 
next thing you need to do now is make sure the condition
for the event to work is that Self Switch A is turned on.
After doing that, you can make everything in the second
page as parallel process or custom movement, to do whatever
you want it to.
*/
var Soulpour777 = Soulpour777 || {};
Soulpour777.Sensor = {
  structAlias: {
    Game_Event: {
      initialize: Game_Event.prototype.initialize,
      update: Game_Event.prototype.update
    },
    Game_System: {
      initialize: Game_System.prototype.initialize,
    },
    Game_Interpreter: {
      pluginCommand: Game_Interpreter.prototype.pluginCommand,
    }
  }
};

Game_System.prototype.initialize = function() {
  Soulpour777.Sensor.structAlias.Game_System.initialize.apply(this, arguments);
  this._pageCommand = 'A';
}

Game_Interpreter.prototype.pluginCommand = function(command, args) {
  Soulpour777.Sensor.structAlias.Game_Interpreter.pluginCommand.apply(this, arguments);
  switch(command) {
    case 'setSensorPage':
      if (args[0] === 'A') {
        $gameSystem._pageCommand = 'A';
      }    
      if (args[0] === 'B') {
        $gameSystem._pageCommand = 'B';
      } 
      if (args[0] === 'C') {
        $gameSystem._pageCommand = 'C';
      } 
      if (args[0] === 'D') {
        $gameSystem._pageCommand = 'D';
      }                     
      break;
    default:
      $gameSystem._pageCommand = 'A';
      break;
  }  
};
 
Game_Event.prototype.initialize = function()
{
    Soulpour777.Sensor.structAlias.Game_Event.initialize.apply(this, arguments);
    this.setSensorAndShift();
};

Game_Event.prototype.update = function()
{
    Soulpour777.Sensor.structAlias.Game_Event.update.apply(this, arguments);
    this.checkEventDistanceSensor();
};
 
Game_Event.prototype.checkEventDistanceSensor = function() {
    if (this._action) {
         if (Math.abs($gamePlayer.x - this.event().x) <= this._sensorRange && Math.abs($gamePlayer.y - this.event().y) <= this._sensorRange) {
             $gameSelfSwitches.setValue([$gameMap._mapId, this.event().id, $gameSystem._pageCommand], true);
         }
    }
}
 
Game_Event.prototype.setSensorAndShift = function()
{
    var comment = "";
    this._shifts = false;
    this._action = false;
    this._sensorRange = 0;
    if (this.page())
    {
        var pagelist = this.page().list;
        for (cmd of pagelist) if(cmd.code === 108 || cmd.code === 408) comment += cmd.parameters[0] + "\n";
        var sensor = comment.match(/<\s*sensor\s*:\s*(\d+)\s*>/im);
        this._action = (comment.match(/<\s*action\s*>/im) !== null);
        if(sensor) this._sensorRange = Number(sensor[1]);
    }
}