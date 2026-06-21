using Ttc.WebApi.Utilities.Pipeline;

namespace Ttc.UnitTests;

public class SetupLoggerTests
{
    [Theory]
    [InlineData("main", "ttc")]
    [InlineData(null, "ttc")]
    [InlineData("", "ttc")]
    [InlineData("dev", "ttc-dev")]
    [InlineData("feat/add-x", "ttc-feat-add-x")]
    [InlineData("PR-12", "ttc-pr-12")]
    public void AppLabelForBranch_MapsBranchToLokiLabel(string? branch, string expected)
    {
        Assert.Equal(expected, SetupLogger.AppLabelForBranch(branch));
    }
}
