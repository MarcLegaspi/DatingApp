using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class ValuesController : ControllerBase
    {
        private readonly DataContext _context;
        public ValuesController(DataContext context)
        {
            this._context = context;
        }
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var values = await _context.Values.ToListAsync();

            return Ok(values);
        }

        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var values = await _context.Values.FirstOrDefaultAsync(m => m.Id == id);

            return Ok(values);
        }
    }
}
