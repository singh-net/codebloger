using System.ComponentModel.DataAnnotations;

namespace API.Dtos
{
    public class RegisterDto
    {
        [Required] public string Username { get; set; }
        [Required] public string Email { get; set; }

        [StringLength(20, MinimumLength = 8)]        
        [Required] public string Password { get; set; }
    }
}