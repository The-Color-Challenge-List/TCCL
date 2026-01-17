/**
 * Numbers of decimal digits to round to
 */
const scale = 3;

/**
 * Fixed points for Top 20
 * Drop starts at -19 and decreases by 1 each rank
 */
const TOP_20_POINTS = [
    350, // 1
    331, // 2
    313, // 3
    296, // 4
    280, // 5
    265, // 6
    251, // 7
    238, // 8
    226, // 9
    215, // 10
    205, // 11
    196, // 12
    188, // 13
    181, // 14
    175, // 15
    170, // 16
    166, // 17
    163, // 18
    161, // 19
    160  // 20
];

/**
 * Calculate the score awarded when having a certain percentage on a list level
 * @param {Number} rank Position on the list
 * @param {Number} percent Percentage of completion
 * @param {Number} minPercent Minimum percentage required
 * @returns {Number}
 */
export function score(rank, percent, minPercent) {
    if (rank > 150) {
        return 0;
    }

    if (rank > 75 && percent < 100) {
        return 0;
    }

    let baseScore;

    // Top 20: fixed values
    if (rank <= 20) {
        baseScore = TOP_20_POINTS[rank - 1];
    }
    // After top 20: lose 1 point per rank
    else {
        baseScore = TOP_20_POINTS[19] - (rank - 20);
    }

    // Scale by percent completed
    let scaledScore =
        baseScore *
        ((percent - (minPercent - 1)) / (100 - (minPercent - 1)));

    scaledScore = Math.max(0, scaledScore);

    // Penalty for not being 100%
    if (percent !== 100) {
        return round(scaledScore - scaledScore / 3);
    }

    return Math.max(round(scaledScore), 0);
}

/**
 * Rounds a number to a fixed decimal scale
 */
export function round(num) {
    if (!('' + num).includes('e')) {
        return +(Math.round(num + 'e+' + scale) + 'e-' + scale);
    } else {
        const arr = ('' + num).split('e');
        const sig = +arr[1] + scale > 0 ? '+' : '';
        return +(
            Math.round(+arr[0] + 'e' + sig + (+arr[1] + scale)) +
            'e-' +
            scale
        );
    }
}
