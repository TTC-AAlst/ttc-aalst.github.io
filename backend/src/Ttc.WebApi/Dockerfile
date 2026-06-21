FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build

WORKDIR /source

COPY *.slnx .
# Central Package Management: restore needs these at the solution root to resolve
# the versionless <PackageReference>s in each csproj.
COPY Directory.Packages.props Directory.Build.props ./
COPY src/Ttc.WebApi/*.csproj ./src/Ttc.WebApi/
COPY src/Frenoy.Api/*.csproj ./src/Frenoy.Api/
COPY src/Ttc.DataAccess/*.csproj ./src/Ttc.DataAccess/
COPY src/Ttc.DataEntities/*.csproj ./src/Ttc.DataEntities/
COPY src/Ttc.Model/*.csproj ./src/Ttc.Model/
COPY src/Ttc.UnitTests/*.csproj ./src/Ttc.UnitTests/

RUN dotnet restore

COPY src/Ttc.UnitTests/. ./src/Ttc.UnitTests/
COPY src/Ttc.DataEntities/. ./src/Ttc.DataEntities/
COPY src/Ttc.DataAccess/. ./src/Ttc.DataAccess/
COPY src/Ttc.Model/. ./src/Ttc.Model/
COPY src/Frenoy.Api/. ./src/Frenoy.Api/
COPY src/Ttc.WebApi/. ./src/Ttc.WebApi/

WORKDIR /source/src/Ttc.WebApi
RUN dotnet publish -c Release -o /app



FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
# Coolify injects COOLIFY_BRANCH as a build ARG (not via compose env, which it
# pre-substitutes to empty). Bake it into a runtime ENV so SetupLogger can read
# it to derive the Loki `app` label (ttc / ttc-dev / ttc-<pr-branch>).
ARG COOLIFY_BRANCH=
ENV COOLIFY_BRANCH=$COOLIFY_BRANCH
COPY --from=build /app .
ENTRYPOINT [ "dotnet", "/app/Ttc.WebApi.dll" ]
