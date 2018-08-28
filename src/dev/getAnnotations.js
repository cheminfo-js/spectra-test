'use strict';

const fs = require('fs');

const debug = require('debug')('dev/getAnnotations');

const data = require('../jsgraph/data.json');

const getMediator = require('./lineFunctions/getMediator');
const getAnnotation = require('./getAnnotation');

getAnnotations(getMediator, data);

/**
  * Creates a file lines.json with line annotations for all the points of a spetrum
  * @param {function} [lineReturningFct] - Function that returns a line for a point of a spectrum in the format { slope: -0.33, offset: 55 }
  * @param {data} [data] - Your spectrum data in the format {x:[x1, x2, ...], y:[y1, y2, ...]}
  * @param {object} [options = {}]
  * @param {number} [options.segmentLength = 10] - Length of the segment / line in graph units
  * @param {number} [options.from = 0] - Starting index value for which a line is desired
  * @param {number} [options.to = data.x.length] - Ending index value for which a line is desired. Default is lines for the whole graph.
  * @param {number} [options.threshold = 1e-14] - Over this uncertainty, returns an error message
  * @param {string} [options.name = 'annotations.json'] - Name of the generated annotations file
  */
function getAnnotations(lineReturningFct, data, options = {}) {
  const {
    from = 0,
    to = data.x.length,
    name = 'annotations.json'
  } = options;

  var lines = [];

  for (var index = from; index < to - 1; index++) {
    var segment = getAnnotation(lineReturningFct, data, index, options);
    debug('segment =', segment);

    lines.push(segment);
  }

  fs.writeFileSync(
    `${__dirname}/autoGenerated/${name}`,
    JSON.stringify(lines),
    'utf8'
  );
}

module.exports = getAnnotations;
