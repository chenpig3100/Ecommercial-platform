using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Ecommerce.Api.Data;
using Ecommerce.Api.DTOs;
using Ecommerce.Api.Infrastructure.Errors;
using Ecommerce.Api.Models;
using Ecommerce.Api.Services;

namespace Ecommerce.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly TokenService _tokenService;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            TokenService tokenService)
        {
            _userManager = userManager;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                return this.ApiBadRequest(
                    "Email already exists.",
                    new Dictionary<string, string[]>
                    {
                        ["email"] = ["Email already exists."]
                    });
            }

            var user = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email
            };

            var result = await _userManager.CreateAsync(user, dto.Password);

            if (!result.Succeeded)
            {
                return this.ApiBadRequest(
                    "Registration failed.",
                    new Dictionary<string, string[]>
                    {
                        ["password"] = result.Errors.Select(error => error.Description).ToArray()
                    });
            }

            var roleResult = await _userManager.AddToRoleAsync(user, IdentitySeeder.BuyerRole);
            if (!roleResult.Succeeded)
            {
                return this.ApiError(
                    StatusCodes.Status500InternalServerError,
                    "Failed to assign the default role.",
                    new Dictionary<string, string[]>
                    {
                        ["roles"] = roleResult.Errors.Select(error => error.Description).ToArray()
                    });
            }

            return Ok(new { message = "User registered successfully." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null)
            {
                return this.ApiUnauthorized("Invalid email or password.");
            }

            var validPassword = await _userManager.CheckPasswordAsync(user, dto.Password);
            if (!validPassword)
            {
                return this.ApiUnauthorized("Invalid email or password.");
            }

            var roles = await _userManager.GetRolesAsync(user);
            var token = _tokenService.CreateToken(user, roles);

            return Ok(new
            {
                token,
                email = user.Email,
                roles
            });
        }
    }
}
