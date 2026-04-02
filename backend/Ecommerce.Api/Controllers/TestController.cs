using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ecommerce.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet("public")]
        public IActionResult Public()
        {
            return Ok(new { message = "This is a public endpoint." });
        }

        [Authorize]
        [HttpGet("private")]
        public IActionResult Private()
        {
            return Ok(new { message = "You are authenticated." });
        }
    }
}