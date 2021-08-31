using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class ArticlePhotoRelation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ArticleId",
                table: "Photos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Photos_ArticleId",
                table: "Photos",
                column: "ArticleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Articles_ArticleId",
                table: "Photos",
                column: "ArticleId",
                principalTable: "Articles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Articles_ArticleId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_ArticleId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "ArticleId",
                table: "Photos");
        }
    }
}
