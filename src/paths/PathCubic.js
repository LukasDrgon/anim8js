
/**
 * Instantiates a new PathCubic.
 *
 * @param {String|false} name
 * @param {Calculator} calculator
 * @param {T} p0
 * @param {T} p1
 * @param {T} p2
 * @param {T} p3
 * @class PathCubic
 * @constructor
 * @extends Path
 */
function PathCubic(name, calculator, p0, p1, p2, p3)
{
  this.name = name;
  this.set( calculator, p0, p1, p2, p3 );
}

Class.extend( PathCubic, Path,
{
  set: function(calculator, p0, p1, p2, p3)
  {
    this.reset( calculator, [p0, p1, p2, p3] );
  },

  compute: function(out, d1)
  {
    var calc = this.calculator;
    var d2 = d1 * d1;
    var d3 = d1 * d2;
    var i1 = 1 - d1;
    var i2 = i1 * i1;
    var i3 = i1 * i2;

    out = calc.copy( out, this.resolvePoint( 0, d1 ) );
    out = calc.scale( out, i3 );
    out = calc.adds( out, this.resolvePoint( 1, d1 ), 3 * i2 * d1 );
    out = calc.adds( out, this.resolvePoint( 2, d1 ), 3 * i1 * d2 );
    out = calc.adds( out, this.resolvePoint( 3, d1 ), d3 );

    return out;
  },

  copy: function()
  {
    return new PathCubic( this.name, this.calculator, this.points[0], this.points[1], this.points[2], this.points[3] );
  },

  isLinear: function()
  {
    return false;
  }
});
