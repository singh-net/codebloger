using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class CascadeNoDeleteArticle : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ArticleLikes_Articles_ArticleId",
                table: "ArticleLikes");

            migrationBuilder.DropForeignKey(
                name: "FK_ArticleLikes_AspNetUsers_AppUserId",
                table: "ArticleLikes");

            migrationBuilder.AddForeignKey(
                name: "FK_ArticleLikes_Articles_ArticleId",
                table: "ArticleLikes",
                column: "ArticleId",
                principalTable: "Articles",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ArticleLikes_AspNetUsers_AppUserId",
                table: "ArticleLikes",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ArticleLikes_Articles_ArticleId",
                table: "ArticleLikes");

            migrationBuilder.DropForeignKey(
                name: "FK_ArticleLikes_AspNetUsers_AppUserId",
                table: "ArticleLikes");

            migrationBuilder.AddForeignKey(
                name: "FK_ArticleLikes_Articles_ArticleId",
                table: "ArticleLikes",
                column: "ArticleId",
                principalTable: "Articles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_ArticleLikes_AspNetUsers_AppUserId",
                table: "ArticleLikes",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
