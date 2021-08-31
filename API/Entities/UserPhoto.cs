namespace API.Entities
{
    public class UserPhoto
    {
        public int Id { get; set; }
        public string Url { get; set; }
        public bool IsMain { get; set; }
        public bool isProfileImage { get; set; }
        public string PublicId { get; set; }
        public AppUser AppUser { get; set; }
        public int AppUserId { get; set; }
    }
}