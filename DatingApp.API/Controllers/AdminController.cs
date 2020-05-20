using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using DatingApp.API.ModelDtos;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly DataContext _dataContext;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        public AdminController(DataContext dataContext, UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _dataContext = dataContext;

        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("usersWithRoles")]
        public async Task<IActionResult> GetUsersWithRoles()
        {
            var users = await _dataContext.Users
                    .OrderBy(m => m.UserName)
                    .Select(user => new
                    {
                        Id = user.Id,
                        UserName = user.UserName,
                        Roles = (from userRoles in user.UserRoles
                                 join role in _dataContext.Roles
                                     on userRoles.RoleId
                                     equals role.Id
                                 select role.Name).ToList()
                    }).ToListAsync();

            return Ok(users);
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photosForModeration")]
        public IActionResult GetPhotosForModeration()
        {
            return Ok("Admin or moderators can see this");
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("editRoles/{userName}")]
        public async Task<IActionResult> EditRoles(string userName, RoleEditDto roleEditDto)
        {
            var user = await _userManager.FindByNameAsync(userName);

            var userRoles = await _userManager.GetRolesAsync(user);
            var selectedRoles = roleEditDto.RoleNames;

            selectedRoles = selectedRoles ?? new string[] { };
            
            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded)
                return BadRequest("Failed to add to roles");



            var rolesToRemove = userRoles.Except(selectedRoles);


            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));

            if (!result.Succeeded)
                return BadRequest("Failed to remove to roles");

            return Ok(await _userManager.GetRolesAsync(user));
        }
    }
}