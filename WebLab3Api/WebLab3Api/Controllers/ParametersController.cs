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

        // POST api/parameters
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Parameters body)
        {
            await Db.Connection.OpenAsync();

            body.Db = Db;
            await body.InsertAsync();

            return new OkObjectResult(body);
        }

        // PUT api/parameters/id
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOneById(int id, [FromBody] Parameters body)
        {
            await Db.Connection.OpenAsync();

            var query = new ParametersQuery(Db);
            var result = await query.FindOneAsync(id);

            if (result is null)
                return new NotFoundResult();

            result.NumOfTabs = body.NumOfTabs;
            result.ContentOfTabs = body.ContentOfTabs;
            await result.UpdateAsync();

            return new OkObjectResult(result);
        }


        public AppDb Db { get; }
    }
}
