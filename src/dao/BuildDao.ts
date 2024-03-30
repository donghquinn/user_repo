import sql from 'mysql';

// exports.parseObject = (bigObject, targetArray, addObj) => {
//     let retObject = {};
//     let position = 0;

//     for (let i = 0; i < targetArray.length; i++) {
//         retObject[targetArray[i]] = bigObject[targetArray[i]];

//         let flag = targetArray[i];
//         let cnt = 0;
//         while (flag.search('_') > 0) {
//             position = flag.search('_');
//             if (position > 0 && retObject[targetArray[i]] === undefined) {
//                 retObject[targetArray[i]] = bigObject[flag.substr(0, position) +
//  flag[ position + 1 ].toUpperCase() + flag.substr( position + 2 )];
//                 flag = flag.substr(0, position) + flag[position + 1].toUpperCase() + flag.substr(position + 2);

//             }

//             if (++cnt > 10)
//                 break;
//         }
//     }

//     if (addObj !== undefined)
//         for (let k in Object.keys(addObj))
//             retObject[k] = addObj[k];

//     return retObject;
// };

exports.buildInsert = (tblName: string, insertObj: Record<string, string>, option: string) => {

    if (typeof (option) != 'string')
        option = '';

    let query =
        "   INSERT " + option + " INTO " + tblName +
        "   SET ";

    let idx = 0;
    for (let k in insertObj) {
        try {
            if (insertObj[k][0] === '\\')
                query += k + " = " + insertObj[k].slice(1, insertObj[k].length);
            else
                query += k + " = " + sql.escape(insertObj[k]);

        } catch (err) {
            query += k + " = " + sql.escape(insertObj[k]);

        }

        if (++idx < Object.keys(insertObj).length)
            query += ", ";

    }

    return query;
};

exports.buildInsertMultiple = (tblName: string, insertArr: Array<any>) => {

    if(insertArr.length == 0)
        return " SELECT 1";

    let query =
        "   INSERT INTO " + tblName + " (";

    for (let val in insertArr[0]) {
        query += val + ", ";

    }

    query = query.substring(0, query.length - 2) + ") VALUES ";

    for (let i = 0; i < insertArr.length; i++) {
        query += "(";

        let idx = 0;
        for (let val in insertArr[i]) {
            try {
                if (insertArr[i][val][0] === '\\')
                    query += insertArr[i][val].slice(1, insertArr[i][val].length);
                else
                    query += sql.escape(insertArr[i][val]);

            } catch (err) {
                query += sql.escape(insertArr[i][val]);

            }

            if (++idx < Object.keys(insertArr[i]).length)
                query += ", ";

        }

        query += ")";

        if (i + 1 < insertArr.length)
            query += ", ";
    }

    return query;
};

exports.buildUpdate = (tblName: string, updateObj: Record<string, string>, whereObj: Record<string, string>) => {

    let query =
        "   UPDATE " + tblName +
        "   SET ";

    let idx = 0;
    for (let k in updateObj) {
        try {
            if (updateObj[k] === null)
                query += k + " = NULL ";
            else if (updateObj[k][0] === '\\')
                query += k + " = " + updateObj[k].slice(1, updateObj[k].length);
            else
                query += k + " = " + sql.escape(updateObj[k]);

        } catch (err) {
            query += k + " = " + sql.escape(updateObj[k]);

        }

        if (++idx < Object.keys(updateObj).length)
            query += ", ";

    }

    query += " WHERE 1 = 1 ";

    for (let k in whereObj) {
        try {
            if (whereObj[k][0] === '\\')
                if (whereObj[k][1] === '\\')
                    query += " AND " + k + " " + whereObj[k].slice(2, whereObj[k].length);
                else
                    query += " AND " + k + " = " + whereObj[k].slice(1, whereObj[k].length);
            else
                query += " AND " + k + " = " + sql.escape(whereObj[k]);

        } catch (err) {
            query += " AND " + k + " = " + sql.escape(whereObj[k]);

        }
    }
    return query;
};

exports.buildDelete = (tblName: string, whereObj: Record<string, string>) => {

    let query =
        "   DELETE FROM " + tblName +
        "   WHERE 1 = 1 ";
for (let k in whereObj) {
        try {
            if (whereObj[k][0] === '\\')
                if (whereObj[k][1] === '\\')
                    query += " AND " + k + " " + whereObj[k].slice(2, whereObj[k].length);
                else
                    query += " AND " + k + " = " + whereObj[k].slice(1, whereObj[k].length);
            else
                query += " AND " + k + " = " + sql.escape(whereObj[k]);

        } catch (err) {
            query += " AND " + k + " = " + sql.escape(whereObj[k]);

        }
    }

    return query;
};

exports.buildSelect = (tblName: string, whereObj: Record<string, string>, addTxt: string, selectColumnTxt: string) => {

    let query =
        "   SELECT " + (selectColumnTxt ? selectColumnTxt : ' * ') +
        "   FROM " + tblName + " t " +
        "   WHERE 1 = 1 ";

    if (whereObj !== undefined)
        for (let k in whereObj) {
            try {
                if (whereObj[k][0] === '\\')
                    if (whereObj[k][1] === '\\')
                        query += " AND " + k + " " + whereObj[k].slice(2, whereObj[k].length);
                    else
                        query += " AND " + k + " = " + whereObj[k].slice(1, whereObj[k].length);
                else
                    query += " AND " + k + " = " + sql.escape(whereObj[k]);

            } catch (err) {
                query += " AND " + k + " = " + sql.escape(whereObj[k]);

            }
        }

    query += ' ';

    if (addTxt !== undefined)
        query += addTxt;

    return query;
};

exports.buildCount = (tblName: string, whereObj: Record<string, string>, addQuery: string) => {

    let query =
        `   SELECT COUNT(*) as count  FROM  + ${tblName} WHERE 1 = 1 `;

    for (let k in whereObj) {
        try {
            if (whereObj[k][0] === '\\')
                if (whereObj[k][1] === '\\')
                    query += " AND " + k + " " + whereObj[k].slice(2, whereObj[k].length);
                else
                    query += " AND " + k + " = " + whereObj[k].slice(1, whereObj[k].length);
            else
                query += " AND " + k + " = " + sql.escape(whereObj[k]);

        } catch (err) {
            query += " AND " + k + " = " + sql.escape(whereObj[k]);

        }
    }

    query += ' ';

    if (addQuery !== undefined)
        query += addQuery;

    return query;
};

export const appendLeftJoin = (
    input: string,
    tblName: string,
    mapperList: Array<string>,
    appendColumnList: string,
    clearOriginSelect: boolean
) =>
{
    let query = "   SELECT i.* ";

    if(typeof appendColumnList === 'object') {
        for (let item of appendColumnList)
            if (item[0] === "\\") query += `, ${item.slice(1, item.length)}`;
            else query += `, j.${item}`;
    } else {
        query += `, + ${appendColumnList};`

    }

    if (clearOriginSelect)
        query = query.replace("i.* ,", "");

    query +=
        `   FROM ( " + ${input} + " ) i  LEFT JOIN  + ${tblName} +  j ON `;

    for (let item of mapperList)
        try {
            if ( item[ 0 ] === '\\' ) query += `${ item.slice( 1, item.length ) } AND`;
            else query += `j.${item} = i.${item} AND`; 

        } catch (err) {
            query += `j.${item} = i.${item} AND`;
        }

    return query.slice(0, query.length - 4);
};

export const appendInnerJoin = (
    input: string,
    tblName: string,
    mapperList: Array<string>,
    appendColumnList: string,
    clearOriginSelect: boolean
) =>
{
    let query = "   SELECT i.* ";

    if(typeof appendColumnList === 'object') {
        for ( let item of appendColumnList )
            query += `, j.${item}`;
    } else {
        query += `, ${appendColumnList}`;

    }

    if (clearOriginSelect)
        query = query.replace("i.* ,", "");

    query += `FROM ( "${ input }" ) i FROM (" ${ input } ") i LEFT JOIN ${ tblName } j ON`;

    for (let item of mapperList)
        try {
            if ( item[ 0 ] === '\\' )
                query += `${ item.slice( 1, item.length ) } AND`;
            else
                query += `j.${item} = i.${item} AND`;

        } catch (err) {
            query += `j.${item} = i.${item} AND`;
}

    return query.slice(0, query.length - 4);
};

export const appendJoinTxt = (
    input: string,
    tblName: string,
    joinType: string,
    appendTxt: string,
    appendColumnList: string,
    clearOriginSelect: boolean,
) =>
{
    let query = "   SELECT i.* ";

    if(typeof appendColumnList === 'object') {
        for ( let item of appendColumnList )
            query += `, j.${item}`;
    } else {
        query += `, ${appendColumnList}`;

    }

    if (clearOriginSelect)
        query = query.replace("i.* ,", "");

    query += `   FROM ( " ${ input } " ) i ${ joinType } JOIN ${ tblName } j   ON ${ appendTxt }`;

    return query;
};

export const appendCount = (input: string) => {
    const query = `SELECT COUNT(*) as count FROM ( " ${ input } " ) i`;

    return query;
};

export const txtPageLimit = ( page: number, itemCountPerPage: number ) =>
    ` LIMIT ${ ( page - 1 ) * itemCountPerPage }, ${ itemCountPerPage }`;

export const txtLikeEscape = (columnList: Array<string>, keyword: string) => {
    let txt = "";

    for ( let item of columnList )
        txt += `${item} LIKE ${sql.escape("%" + keyword + "%")} OR`;

    return txt.slice(0, txt.length - 4);
};