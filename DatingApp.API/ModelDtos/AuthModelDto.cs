using System.ComponentModel.DataAnnotations;

namespace DatingApp.API.ModelDtos
{
    public class AuthModelDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [StringLength(8,MinimumLength=4)]
        public string Password { get; set; }     
    }
}