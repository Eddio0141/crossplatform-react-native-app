{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-parts.url = "github:hercules-ci/flake-parts";
  };

  outputs = { flake-parts, nixpkgs, ... } @ inputs:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "x86_64-linux"
      ];
      perSystem = { self', inputs', system, pkgs, ... }:
      {
        _module.args.pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            android-studio
            nodejs
          ];

          ANDROID_HOME = "/home/yuu/Android/Sdk";
        };
      };
    };
}
