using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WebLab3Api.Models;

namespace WebLab3Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ParametersController : ControllerBase
    {
        public ParametersController(AppDb db)
        {
            Db = db;
        }

        // GET api/parameters/id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOneById(int id)
        {
            await Db.Connection.OpenAsync();

            var query = new ParametersQuery(Db);
            var result = await query.FindOneAsync(id);

            if (result is null)
                return new NotFoundResult();

            return new OkObjectResult(result);
        }


        public AppDb Db { get; }
    }
}
