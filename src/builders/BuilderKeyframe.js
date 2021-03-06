
/**
 * Instantiates a new parser for the 'keyframe' animation type.
 *
 * @class BuilderKeyframe
 * @constructor
 * @extends Builder
 */
function BuilderKeyframe()
{

}

Class.extend( BuilderKeyframe, Builder,
{
  aliases: {
    from:     '0',
    start:    '0',
    initial:  '0',
    first:    '0',
    half:     '50',
    middle:   '50',
    to:       '100',
    end:      '100',
    last:     '100'
  },

  parse: function( animation, options, attrimatorMap, helper )
  {
    // 1. Normalize keys by converting aliases to the actual value
    // 2. Split up keys that have commas into multiple entries
    // 3. Validate keys and remove invalid ones - also calculate max key value
    // 4. Sort frames by the key
    // 5. Expand frames to generate delta arrays, value arrays, and easing arrays
    // 6. Generate the attrimators

    var factory = $factory( animation.factory, helper.forObject );
    var kframes = animation.keyframe;
    var easings = animation.easings || {};
    var teasing = $easing( coalesce( options.teasing, Defaults.teasing ) );

    var sort = false;

    // split up comma delimited times
    for (var time in kframes)
    {
      if ( time in this.aliases )
      {
        kframes[ this.aliases[time] ] = kframes[ time ];

        delete kframes[ time ];
      }
      else if ( time.indexOf(',') !== -1 )
      {
        var times = time.split(',');

        for (var i = 0; i < times.length; i++)
        {
          kframes[times[i]] = kframes[time];
        }

        delete kframes[time];

        sort = true;
      }
    }

    var times = [];

    // validate times
    var lastTime = 0.0;
    var maxTime = 0.0;

    for (var time in kframes)
    {
      var t = parseFloat(time);

      if (isNaN(t))
      {
        delete kframes[time];
      }
      else
      {
        if (t < lastTime)
        {
          sort = true;
        }

        times.push({
          order: t,
          key: time,
          value: kframes[time]
        });

        lastTime = t;

        maxTime = Math.max( maxTime, t );
      }
    }

    // sort if necessary
    if (sort)
    {
      times.sort(function(a, b)
      {
        return a.order - b.order;
      });

      kframes = {};

      for (var i = 0; i < times.length; i++)
      {
        kframes[times[i].key] = times[i].value;
      }
    }

    // split up into deltas and values
    var deltas = {};
    var values = {};
    var pathEasings = {};
    var attributes = {};

    for (var i = 0; i < times.length; i++)
    {
      var frame = times[i];
      var easing = coalesce( frame.value.easing, options.easing );

      delete frame.value.easing;

      for (var attr in frame.value)
      {
        if ( !(attr in deltas) )
        {
          deltas[attr] = [];
          values[attr] = [];
          pathEasings[attr] = [];
          attributes[attr] = factory.attribute( attr );
        }

        deltas[attr].push( frame.order / maxTime );
        values[attr].push( attributes[ attr ].parse( frame.value[ attr ] ) );
        pathEasings[attr].push( $easing( coalesce( easings[ attr ], easing ) ) );
      }
    }

    // create events & paths
    for (var attr in deltas)
    {
      var duration    = helper.parseDuration( attr );
      var delay       = helper.parseDelay( attr );
      var sleep       = helper.parseSleep( attr );
      var offset      = helper.parseOffset( attr );
      var repeat      = helper.parseRepeat( attr );
      var scale       = helper.parseScale( attr );
      var scaleBase   = helper.parseScaleBase( attr );
      var parameters  = helper.parseParameters();
      var path        = new PathKeyframe( attr, attributes[attr].calculator, values[attr], deltas[attr], pathEasings[attr] );
      var event       = new Event( attr, path, duration, teasing, delay, sleep, offset, repeat, scale, scaleBase, parameters, true, this, null, animation );

      attrimatorMap.put( attr, event );
    }
  }
});
