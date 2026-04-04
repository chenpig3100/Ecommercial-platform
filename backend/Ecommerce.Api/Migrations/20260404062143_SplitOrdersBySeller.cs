using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Ecommerce.Api.Migrations
{
    /// <inheritdoc />
    public partial class SplitOrdersBySeller : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SellerId",
                table: "OrderItems",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SellerOrderId",
                table: "OrderItems",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "SellerOrders",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    OrderId = table.Column<int>(type: "integer", nullable: false),
                    SellerId = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "Pending"),
                    TotalAmount = table.Column<decimal>(type: "numeric(10,2)", precision: 10, scale: 2, nullable: false),
                    CreatedAtUtc = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SellerOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SellerOrders_AspNetUsers_SellerId",
                        column: x => x.SellerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SellerOrders_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_SellerId",
                table: "OrderItems",
                column: "SellerId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_SellerOrderId",
                table: "OrderItems",
                column: "SellerOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_SellerOrders_OrderId",
                table: "SellerOrders",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_SellerOrders_SellerId",
                table: "SellerOrders",
                column: "SellerId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_AspNetUsers_SellerId",
                table: "OrderItems",
                column: "SellerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_OrderItems_SellerOrders_SellerOrderId",
                table: "OrderItems",
                column: "SellerOrderId",
                principalTable: "SellerOrders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_AspNetUsers_SellerId",
                table: "OrderItems");

            migrationBuilder.DropForeignKey(
                name: "FK_OrderItems_SellerOrders_SellerOrderId",
                table: "OrderItems");

            migrationBuilder.DropTable(
                name: "SellerOrders");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_SellerId",
                table: "OrderItems");

            migrationBuilder.DropIndex(
                name: "IX_OrderItems_SellerOrderId",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "SellerId",
                table: "OrderItems");

            migrationBuilder.DropColumn(
                name: "SellerOrderId",
                table: "OrderItems");
        }
    }
}
