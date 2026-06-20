using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ttc.DataAccess.Migrations;

/// <inheritdoc />
public partial class DateTimePrecisionAndNullableStatus : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AlterColumn<DateTime>(
            name: "Date",
            table: "Tournament",
            type: "datetime(6)",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime");

        migrationBuilder.AlterColumn<DateTime>(
            name: "ModifiedOn",
            table: "Team",
            type: "datetime(6)",
            nullable: true,
            oldClrType: typeof(DateTime),
            oldType: "datetime",
            oldNullable: true);

        migrationBuilder.AlterColumn<DateTime>(
            name: "CreatedOn",
            table: "Team",
            type: "datetime(6)",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime");

        migrationBuilder.AlterColumn<DateTime>(
            name: "ExpiresOn",
            table: "PlayerPasswordReset",
            type: "datetime(6)",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime");

        migrationBuilder.AlterColumn<DateTime>(
            name: "At",
            table: "PlayerLogin",
            type: "datetime(6)",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime");

        migrationBuilder.AlterColumn<DateTime>(
            name: "ModifiedOn",
            table: "Player",
            type: "datetime(6)",
            nullable: true,
            oldClrType: typeof(DateTime),
            oldType: "datetime",
            oldNullable: true);

        migrationBuilder.AlterColumn<DateTime>(
            name: "LastLogin",
            table: "Player",
            type: "datetime(6)",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime");

        migrationBuilder.AlterColumn<DateTime>(
            name: "CreatedOn",
            table: "Player",
            type: "datetime(6)",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime");

        migrationBuilder.AlterColumn<DateTime>(
            name: "ModifiedOn",
            table: "Parameter",
            type: "datetime(6)",
            nullable: true,
            oldClrType: typeof(DateTime),
            oldType: "datetime",
            oldNullable: true);

        migrationBuilder.AlterColumn<DateTime>(
            name: "CreatedOn",
            table: "Parameter",
            type: "datetime(6)",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime");

        migrationBuilder.AlterColumn<string>(
            name: "Status",
            table: "MatchPlayer",
            type: "varchar(10)",
            maxLength: 10,
            nullable: true,
            oldClrType: typeof(string),
            oldType: "varchar(10)",
            oldMaxLength: 10);

        migrationBuilder.AlterColumn<DateTime>(
            name: "PostedOn",
            table: "MatchComment",
            type: "datetime(6)",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime");

        migrationBuilder.AlterColumn<DateTime>(
            name: "ModifiedOn",
            table: "Match",
            type: "datetime(6)",
            nullable: true,
            oldClrType: typeof(DateTime),
            oldType: "datetime",
            oldNullable: true);

        migrationBuilder.AlterColumn<DateTime>(
            name: "Date",
            table: "Match",
            type: "datetime(6)",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime");

        migrationBuilder.AlterColumn<DateTime>(
            name: "CreatedOn",
            table: "Match",
            type: "datetime(6)",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime");

        migrationBuilder.AlterColumn<DateTime>(
            name: "ModifiedOn",
            table: "Event",
            type: "datetime(6)",
            nullable: true,
            oldClrType: typeof(DateTime),
            oldType: "datetime",
            oldNullable: true);

        migrationBuilder.AlterColumn<DateTime>(
            name: "CreatedOn",
            table: "Event",
            type: "datetime(6)",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime");

        migrationBuilder.AlterColumn<DateTime>(
            name: "ModifiedOn",
            table: "Club",
            type: "datetime(6)",
            nullable: true,
            oldClrType: typeof(DateTime),
            oldType: "datetime",
            oldNullable: true);

        migrationBuilder.AlterColumn<DateTime>(
            name: "CreatedOn",
            table: "Club",
            type: "datetime(6)",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AlterColumn<DateTime>(
            name: "Date",
            table: "Tournament",
            type: "datetime",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)");

        migrationBuilder.AlterColumn<DateTime>(
            name: "ModifiedOn",
            table: "Team",
            type: "datetime",
            nullable: true,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)",
            oldNullable: true);

        migrationBuilder.AlterColumn<DateTime>(
            name: "CreatedOn",
            table: "Team",
            type: "datetime",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)");

        migrationBuilder.AlterColumn<DateTime>(
            name: "ExpiresOn",
            table: "PlayerPasswordReset",
            type: "datetime",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)");

        migrationBuilder.AlterColumn<DateTime>(
            name: "At",
            table: "PlayerLogin",
            type: "datetime",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)");

        migrationBuilder.AlterColumn<DateTime>(
            name: "ModifiedOn",
            table: "Player",
            type: "datetime",
            nullable: true,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)",
            oldNullable: true);

        migrationBuilder.AlterColumn<DateTime>(
            name: "LastLogin",
            table: "Player",
            type: "datetime",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)");

        migrationBuilder.AlterColumn<DateTime>(
            name: "CreatedOn",
            table: "Player",
            type: "datetime",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)");

        migrationBuilder.AlterColumn<DateTime>(
            name: "ModifiedOn",
            table: "Parameter",
            type: "datetime",
            nullable: true,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)",
            oldNullable: true);

        migrationBuilder.AlterColumn<DateTime>(
            name: "CreatedOn",
            table: "Parameter",
            type: "datetime",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)");

        migrationBuilder.AlterColumn<string>(
            name: "Status",
            table: "MatchPlayer",
            type: "varchar(10)",
            maxLength: 10,
            nullable: false,
            defaultValue: "",
            oldClrType: typeof(string),
            oldType: "varchar(10)",
            oldMaxLength: 10,
            oldNullable: true);

        migrationBuilder.AlterColumn<DateTime>(
            name: "PostedOn",
            table: "MatchComment",
            type: "datetime",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)");

        migrationBuilder.AlterColumn<DateTime>(
            name: "ModifiedOn",
            table: "Match",
            type: "datetime",
            nullable: true,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)",
            oldNullable: true);

        migrationBuilder.AlterColumn<DateTime>(
            name: "Date",
            table: "Match",
            type: "datetime",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)");

        migrationBuilder.AlterColumn<DateTime>(
            name: "CreatedOn",
            table: "Match",
            type: "datetime",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)");

        migrationBuilder.AlterColumn<DateTime>(
            name: "ModifiedOn",
            table: "Event",
            type: "datetime",
            nullable: true,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)",
            oldNullable: true);

        migrationBuilder.AlterColumn<DateTime>(
            name: "CreatedOn",
            table: "Event",
            type: "datetime",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)");

        migrationBuilder.AlterColumn<DateTime>(
            name: "ModifiedOn",
            table: "Club",
            type: "datetime",
            nullable: true,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)",
            oldNullable: true);

        migrationBuilder.AlterColumn<DateTime>(
            name: "CreatedOn",
            table: "Club",
            type: "datetime",
            nullable: false,
            oldClrType: typeof(DateTime),
            oldType: "datetime(6)");
    }
}
