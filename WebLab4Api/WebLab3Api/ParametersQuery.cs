using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Threading.Tasks;
using MySqlConnector;
using WebLab3Api.Models;

namespace WebLab3Api
{
    public class ParametersQuery
    {
        public AppDb Db { get; }

        public ParametersQuery(AppDb db)
        {
            Db = db;
        }

        public async Task<Parameters> FindOneAsync(int id)
        {
            using var cmd = Db.Connection.CreateCommand();
            cmd.CommandText = @"SELECT `ID`, `BiggerDiameter`, `SmallerDiameter`, `ShiftForBigger`, `ShiftForSmaller`, `CanvasShiftForBigger`, `CanvasShiftForSmaller` FROM `web4parameters` WHERE `ID` = @ID";
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@ID",
                DbType = DbType.Int32,
                Value = id,
            });
            var result = await ReadAllAsync(await cmd.ExecuteReaderAsync());
            return result.Count > 0 ? result[0] : null;
        }

        private async Task<List<Parameters>> ReadAllAsync(DbDataReader reader)
        {
            var posts = new List<Parameters>();
            using (reader)
            {
                while (await reader.ReadAsync())
                {
                    var post = new Parameters(Db)
                    {
                        ID = reader.GetInt32(0),
                        BiggerDiameter = reader.GetInt32(1),
                        SmallerDiameter = reader.GetInt32(2),
                        ShiftForBigger = reader.GetInt32(3),
                        ShiftForSmaller = reader.GetInt32(4),
                        CanvasShiftForBigger = reader.GetInt32(5),
                        CanvasShiftForSmaller = reader.GetInt32(6),
                    };
                    posts.Add(post);
                }
            }
            return posts;
        }

    }
}
