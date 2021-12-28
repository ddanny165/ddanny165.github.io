using System.Data;
using System.Threading.Tasks;
using MySqlConnector;

namespace WebLab3Api.Models
{
    public class Parameters
    {
        public int ID { get; set; }
        public int BiggerDiameter { get; set; }
        public int SmallerDiameter { get; set; }
        public int ShiftForBigger { get; set; }
        public int ShiftForSmaller { get; set; }
        public int CanvasShiftForBigger { get; set; }
        public int CanvasShiftForSmaller { get; set; }

        internal AppDb Db { get; set; }
        
        internal Parameters(AppDb db)
        {
            Db = db;
        }


        public Parameters()
        {

        }
    }
}
