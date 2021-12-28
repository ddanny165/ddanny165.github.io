using System.Data;
using System.Threading.Tasks;
using MySqlConnector;

namespace WebLab3Api.Models
{
    public class Parameters
    {
        public int Id { get; set; }
        public int NumOfTabs { get; set; }
        public string ContentOfTabs { get; set; }

        internal AppDb Db { get; set; }
        
        internal Parameters(AppDb db)
        {
            Db = db;
        }


        public Parameters()
        {

        }

        public async Task InsertAsync()
        {
            using var cmd = Db.Connection.CreateCommand();
            cmd.CommandText = @"INSERT INTO `parameters` (`Id`, `NumOfTabs`, `ContentOfTabs`) VALUES (@id, @numOfTabs, @contentOfTabs);";
            BindParams(cmd);
            BindId(cmd);
            await cmd.ExecuteNonQueryAsync();
        }

        public async Task UpdateAsync()
        {
            using var cmd = Db.Connection.CreateCommand();
            cmd.CommandText = @"UPDATE `parameters` SET `NumOfTabs` = @numOfTabs, `ContentOfTabs` = @contentOfTabs WHERE `Id` = @id;";
            BindParams(cmd);
            BindId(cmd);
            await cmd.ExecuteNonQueryAsync();
        }

        private void BindId(MySqlCommand cmd)
        {
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@id",
                DbType = DbType.Int32,
                Value = Id,
            });
        }

        private void BindParams(MySqlCommand cmd)
        {
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@numOfTabs",
                DbType = DbType.Int32,
                Value = NumOfTabs,
            });
            cmd.Parameters.Add(new MySqlParameter
            {
                ParameterName = "@contentOfTabs",
                DbType = DbType.String,
                Value = ContentOfTabs,
            });
        }


    }
}
