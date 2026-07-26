def __init__(self, registry_path: str = None):
        if registry_path is None:
            self.registry_path = Path(r"C:\Users\direc\OneDrive\Documents\PROJECT GOLD\PROJECT_GOLD_CORE\01_INTEL _GATHERING\target_registry.json")
        else:
            self.registry_path = Path(registry_path)