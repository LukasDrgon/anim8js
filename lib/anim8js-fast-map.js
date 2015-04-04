
/**
 * A FastMap has the key-to-value benefits of a map and iteration benefits of an array.
 * This is especially beneficial when most of the time the contents of the structure need to be iterated and order
 * doesn't matter (since removal performs a swap which breaks insertion order).
 */
anim8.FastMap = function()
{
  this.values = [];
  this.keys = [];
  this.indices = {};
};

anim8.FastMap.prototype =
{
  /**
   * Puts the value in the map by the given key.
   * 
   * @param  {string} key
   * @param  {any} value
   * @return {this}
   */
  put: function(key, value)
  {
    if ( key in this.indices )
    {
      this.values[ this.indices[ key ] ] = value;
    }
    else
    {
      this.indices[ key ] = this.values.length;
      this.values.push( value );
      this.keys.push( key );
    }

    return this;
  },

  /**
   * Puts all keys & values on the given map into this map overwriting any existing values mapped by similar keys.
   * 
   * @param  {anim8.FastMap}
   * @return {this}
   */
  putMap: function(map)
  {
    var keys = map.keys;
    var values = map.values;

    for (var i = 0; i < keys.length; i++)
    {
      this.put( keys[ i ], values[ i ] );
    }

    return this;
  },

  /**
   * Returns the value mapped by the given key.
   * 
   * @param  {string} key
   * @return {any}
   */
  get: function(key)
  {
    return this.values[ this.indices[ key ] ];
  },

  /**
   * Removes the value by a given key
   * 
   * @param  {string} key
   * @return {this}
   */
  remove: function(key)
  {
    if ( key in this.indices )
    {
      var index = this.indices[ key ];
      var lastValue = this.values.pop();
      var lastKey = this.keys.pop();

      if ( index < this.values.length )
      {
        this.values[ index ] = lastValue;
        this.keys[ index ] = lastKey;
        this.indices[ lastKey ] = index;
      }

      delete this.indices[ key ];
    }

    return this;
  },

  /**
   * Returns the index of the value in the array given a key.
   * 
   * @param  {string} key
   * @return {number}
   */
  indexOf: function(key)
  {
    return this.indices[ key ];
  },

  /**
   * Returns the number of elements in the map.
   * 
   * @return {number}
   */
  size: function()
  {
    return this.values.length;
  }

};