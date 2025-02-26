using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Bidwise.Catalog.Data.Migrations
{
    /// <inheritdoc />
    public partial class ModifyItem_ToHave_VickreyAndBuyerPayAmountColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "BuyerPayAmount",
                table: "Items",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "Vickrey",
                table: "Items",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BuyerPayAmount",
                table: "Items");

            migrationBuilder.DropColumn(
                name: "Vickrey",
                table: "Items");
        }
    }
}
