using Microsoft.EntityFrameworkCore.Migrations;

namespace API.Data.Migrations
{
    public partial class UserPhotoRelation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AppUserId",
                table: "Photos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Photos_AppUserId",
                table: "Photos",
                column: "AppUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_AspNetUsers_AppUserId",
                table: "Photos",
                column: "AppUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_AspNetUsers_AppUserId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_AppUserId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "AppUserId",
                table: "Photos");
        }
    }
}
