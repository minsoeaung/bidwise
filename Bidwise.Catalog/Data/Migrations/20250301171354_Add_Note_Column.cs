using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bidwise.Catalog.Data.Migrations
{
    /// <inheritdoc />
    public partial class Add_Note_Column : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "Items",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Note",
                table: "Items");
        }
    }
}
