namespace API.Helpers
{
    public class UserParams : PaginationParams
    {
        public string CurrentUsername { get; set; }
        public string OrderBy { get; set; } = "dateCreated";
        public string FilterBy { get; set; }
        public string CategoryName { get; set; }
        public string Username { get; set; }
        public bool isSelf { get; set; }
        public bool isAdmin { get; set; }
        public string Filter { get; set; }
        public string Tag { get; set; }

    }
}