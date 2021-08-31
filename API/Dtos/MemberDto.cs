using System;
using System.Collections.Generic;

namespace API.Dtos
{
    public class MemberDto
    {
        public string Name { get; set; }
        public string Username { get; set; }
        public int Id { get; set; }
        public string PhotoUrl { get; set; }
        public string About { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string WorkAt { get; set; }
        public string WorkAs { get; set; }
        public string GithubLink { get; set; }
        public int totalFollowers { get; set; }
        public DateTime Created { get; set; }
        public ICollection<UserPhotoDto> UserPhotos { get; set; }

    }
}