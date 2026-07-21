import re

with open('src/app/consent-form/ConsentFormFlow.tsx', 'r') as f:
    content = f.read()

# 1. Update export and props
content = content.replace('export default function ConsentForm() {', 'export default function ConsentFormFlow({ therapists }: { therapists: any[] }) {')

# 2. Add therapistId to formData
content = content.replace('    ack1: false,\n    fullName: "",', '    ack1: false,\n    therapistId: "",\n    fullName: "",')

# 3. Update validateStep
validate_step_replacement = """  const validateStep = () => {
    switch (step) {
      case 1: return formData.ack1;
      case 2: return formData.therapistId !== "";
      case 3: return formData.fullName && formData.age && formData.phone && formData.emergencyContact.name && formData.emergencyContact.phone && formData.emergencyContact.relation;
      case 4: return formData.ack3;
      case 5: return formData.ack4;
      case 6: return formData.ack5;
      case 7: return formData.ack6;
      case 8: return formData.ack7;
      case 9: return formData.signature && formData.date && formData.finalAck;
      default: return false;
    }
  };"""
content = re.sub(r'  const validateStep = \(\) => \{[\s\S]*?  \};\n', validate_step_replacement + '\n', content)

# 4. Update Math.min to 9
content = content.replace('setStep((prev) => Math.min(prev + 1, 8));', 'setStep((prev) => Math.min(prev + 1, 9));')

# 5. Insert new case 2 and shift existing cases 2-8 to 3-9
# First, reverse-replace cases to prevent overlapping
for i in range(8, 1, -1):
    content = content.replace(f'case {i}:', f'case {i+1}:')
    content = content.replace(f'Section {i}:', f'Section {i+1}:')

new_case_2 = """      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-heading text-[var(--color-gold-900)]">Section 2: Select Your Therapist</h2>
            <div className="text-[var(--color-gold-800)] space-y-4">
              <p>Please select the therapist you will be working with. This ensures your profile and bookings are correctly associated with them.</p>
              
              <div className="mt-6 space-y-3">
                {therapists.map(t => (
                  <label key={t.id} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${formData.therapistId === t.id ? 'border-[var(--color-gold-600)] bg-[var(--color-gold-50)] shadow-sm' : 'border-[var(--color-gold-200)] hover:border-[var(--color-gold-400)]'}`}>
                    <input type="radio" name="therapist" value={t.id} checked={formData.therapistId === t.id} onChange={(e) => updateField("therapistId", e.target.value)} className="w-5 h-5 accent-[var(--color-gold-600)] mr-4" />
                    <div>
                      <div className="font-medium text-[var(--color-gold-900)]">{t.name}</div>
                      <div className="text-sm text-[var(--color-gold-600)]">{t.title}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );"""

content = content.replace('      case 3:\n        return (', new_case_2 + '\n      case 3:\n        return (')

# 6. Update UI counters and buttons from 8 to 9
content = content.replace('Step {step} of 8', 'Step {step} of 9')
content = content.replace('(step / 8)', '(step / 9)')
content = content.replace('step < 8', 'step < 9')

# 7. Remove outer div layout, since page.tsx now has it
# The return statement before:
#   return (
#     <div className="flex-1 flex flex-col items-center py-12 px-4">
#       <div className="w-full max-w-3xl">
#         <div className="mb-8">

# Replace to return just the fragments
content = content.replace('''  return (
    <div className="flex-1 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-3xl">
        <div className="mb-8">''', '''  return (
    <>
      <div className="mb-8">''')

# Close the fragment instead of divs
content = content.replace('''        </div>
      </div>
    </div>
  );''', '''        </div>
    </>
  );''')

with open('src/app/consent-form/ConsentFormFlow.tsx', 'w') as f:
    f.write(content)
