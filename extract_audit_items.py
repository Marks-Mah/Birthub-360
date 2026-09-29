import json

with open('auditoria_codigo_birthub360_2026-09-22.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

melhorar = []
implementar = []

for code_id, state in data['audit_state'].items():
    if state['status'] == 'verificado_melhorar':
        melhorar.append({
            'id': code_id,
            'evidence': state['evidence'],
            'notes': state['notes']
        })
    elif state['status'] == 'verificado_precisa_implementar':
        implementar.append({
            'id': code_id,
            'evidence': state['evidence'],
            'notes': state['notes']
        })

print(f"=== ITENS QUE PRECISAM MELHORAR ({len(melhorar)}) ===\n")
for item in melhorar:
    print(f"{item['id']}: {item['evidence']}")
    if item['notes']:
        print(f"  Notes: {item['notes']}")
    print()

print(f"\n=== ITENS QUE PRECISAM IMPLEMENTAR ({len(implementar)}) ===\n")
for item in implementar:
    print(f"{item['id']}: {item['evidence']}")
    if item['notes']:
        print(f"  Notes: {item['notes']}")
    print()