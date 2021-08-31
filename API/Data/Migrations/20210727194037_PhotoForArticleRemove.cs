using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class PhotoForArticleRemove : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "isForArticle",
                table: "UserPhotos");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "isForArticle",
                table: "UserPhotos",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
