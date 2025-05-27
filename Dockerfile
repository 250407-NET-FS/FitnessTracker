FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["fitnesstracker.api/fitnesstracker.api.csproj", "fitnesstracker.api/"]
COPY ["fitnesstracker.data/fitnesstracker.data.csproj", "fitnesstracker.data/"]
COPY ["fitnesstracker.model/fitnesstracker.model.csproj", "fitnesstracker.model/"]
RUN dotnet restore "fitnesstracker.api/fitnesstracker.api.csproj"

COPY . .
RUN dotnet build "fitnesstracker.api/fitnesstracker.api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "fitnesstracker.api/fitnesstracker.api.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production


ENTRYPOINT ["dotnet", "fitnesstracker.api.dll"]
EXPOSE 80