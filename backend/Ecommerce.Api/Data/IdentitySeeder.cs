using Ecommerce.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace Ecommerce.Api.Data;

public static class IdentitySeeder
{
    public const string BuyerRole = "Buyer";
    public const string SellerRole = "Seller";
    public const string AdminRole = "Admin";

    private const string SellerEmail = "seller@bryanstore.com";
    private const string SellerPassword = "Seller123!";
    private const string AdminEmail = "admin@bryanstore.com";
    private const string AdminPassword = "Admin123!";

    public static async Task SeedAsync(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();

        await EnsureRoleExistsAsync(roleManager, BuyerRole);
        await EnsureRoleExistsAsync(roleManager, SellerRole);
        await EnsureRoleExistsAsync(roleManager, AdminRole);

        await EnsureUserExistsAsync(userManager, SellerEmail, SellerPassword, SellerRole);
        await EnsureUserExistsAsync(userManager, AdminEmail, AdminPassword, AdminRole);
    }

    private static async Task EnsureRoleExistsAsync(RoleManager<IdentityRole> roleManager, string roleName)
    {
        if (await roleManager.RoleExistsAsync(roleName))
        {
            return;
        }

        await roleManager.CreateAsync(new IdentityRole(roleName));
    }

    private static async Task EnsureUserExistsAsync(
        UserManager<ApplicationUser> userManager,
        string email,
        string password,
        string roleName)
    {
        var existingUser = await userManager.FindByEmailAsync(email);
        if (existingUser is null)
        {
            existingUser = new ApplicationUser
            {
                UserName = email,
                Email = email,
                EmailConfirmed = true
            };

            var createResult = await userManager.CreateAsync(existingUser, password);
            if (!createResult.Succeeded)
            {
                var errorMessage = string.Join("; ", createResult.Errors.Select(error => error.Description));
                throw new InvalidOperationException($"Failed to seed user {email}: {errorMessage}");
            }
        }

        if (!await userManager.IsInRoleAsync(existingUser, roleName))
        {
            var addRoleResult = await userManager.AddToRoleAsync(existingUser, roleName);
            if (!addRoleResult.Succeeded)
            {
                var errorMessage = string.Join("; ", addRoleResult.Errors.Select(error => error.Description));
                throw new InvalidOperationException($"Failed to assign role {roleName} to {email}: {errorMessage}");
            }
        }
    }
}
