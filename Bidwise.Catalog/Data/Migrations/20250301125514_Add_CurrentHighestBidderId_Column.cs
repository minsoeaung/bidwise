using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bidwise.Catalog.Data.Migrations
{
    /// <inheritdoc />
    public partial class Add_CurrentHighestBidderId_Column : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CurrentHighestBidderId",
                table: "Items",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentHighestBidderId",
                table: "Items");
        }
    }
}
