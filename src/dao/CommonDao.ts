import sql from 'mysql';

const SqlTemplate = require('../MysqlTemplate');

export const escape = ( txt: string ) => sql.escape( txt );

export const escapeLike = (txt: string) => sql.escape('%' + txt + '%');

export const emptyQuery = () => "    SELECT null ";

export const insert = ( query, next ) =>
{
        SqlTemplate.getSingle(query, function (result) {
        next(result.affectedRows, result.insertId);
    });
}


exports.getInsertAsync = async function (query) {
    try {
        const recordSet = await SqlTemplate.getSingle(query);

        if (recordSet) {
            return recordSet.insertId;
        }

    } catch (err) {
        throw err;
    }
};

exports.insertAsync = async function (query) {
    try {
        const recordSet = await SqlTemplate.getSingle(query);

        if (recordSet) {
            return recordSet.affectedRows;
        }

    } catch (err) {
        throw err;
    }
};

exports.updateAsync = async function (query) {
    try {
        const recordSet = await SqlTemplate.getSingle(query);

        if (recordSet) {
            return recordSet.affectedRows;
        }

    } catch (err) {
        throw err;
    }
};

exports.deleteAsync = async function (query) {
    try {
        const recordSet = await SqlTemplate.getSingle(query);

        if (recordSet) {
            return recordSet.affectedRows;
        }

    } catch (err) {
        throw err;
    }
};


exports.get = function (query, next) {
    if (query.length > 0) {
        SqlTemplate.commit(query, function (recordSet) {
            next(recordSet);
        });

    } else {
        next(true);
    }
};


/**
 * 단일 쿼리 단일 응답을 받음
 * @param query
 * @param next
 * 결과의 1행을 돌려받음
 */

exports.getOneAsync = async function (query) {
    try {
        const recordSet = await SqlTemplate.getSingle(query);

        if (recordSet) {
            return recordSet[0];
        }

    } catch (err) {
        throw err;
    }
};

exports.getSingleAsync = async function (query) {
    try {
        const recordSet = await SqlTemplate.getSingle(query);

        if (recordSet) {
            return recordSet;
        }

    } catch (err) {
        throw err;
    }
};

exports.getCountAsync = async function (query, next) {
    try {
        const recordSet = await SqlTemplate.getSingle(query);

        if (recordSet) {
            return recordSet[0].count;
        }

    } catch (err) {
        throw err;
    }
};



exports.getAsync = async function (query) {
    if (query.length > 0) {
        const recordSet = await SqlTemplate.getSingle(query);
        return recordSet;
    } else {
        return [];

    }
};

// ===========================LEGACY 폐기============================

exports.getOne = function (query, next) {
    SqlTemplate.getSingle(query, function (recordSet) {
        next(recordSet[0]);
    });
};

exports.getCount = function (query, next) {
    SqlTemplate.getSingle(query, function (recordSet) {
        next(recordSet[0].count);
    });
};

exports.getSingle = function (query, next) {
    SqlTemplate.getSingle(query, function (recordSet) {
        next(recordSet);
    });
};

exports.getPage = (head, body, foot, next) => {
    let query = [
        head + body + foot,
        " SELECT COUNT(*) as count " + body
    ];

    SqlTemplate.commit(query, function (recordSet) {
        next(recordSet[0], recordSet[1][0].count);
    });
};

exports.sendOnly = function (query) {
    SqlTemplate.getSingle(query, function (recordSet) {

    });
};

exports.callProcedure = (query, next) => {
    SqlTemplate.get(query, (recordSet) => {
        next(recordSet);
    });
};

exports.callMakeReservation = (userId, dayOfWeek, resTime) => {
    return " CALL p_nf_make_reservation(" + sql.escape(userId) + ", " + sql.escape(dayOfWeek) + ", " + sql.escape(resTime) + ") ";
};