namespace API.Dtos
{
    public class MemberForListDto
    {
        public string Name { get; set; }
        public string Username { get; set; }
        public int Id { get; set; }
        public string PhotoUrl { get; set; }   
        public int TotalFollowers { get; set; }
    }
}